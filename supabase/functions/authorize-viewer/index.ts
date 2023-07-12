import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { errorHandler } from "../_shared/errorHandler.ts";
import { supabase, supabaseAdmin } from "../_shared/supabaseClient.ts";
import { Database } from "../../../types/supabase.types.ts";

type GetLinkProps = Database["public"]["Tables"]["tbl_links"]["Row"] &
  Database["public"]["Tables"]["tbl_documents"]["Row"] &
  Database["public"]["Tables"]["tbl_document_versions"]["Row"];

type AuthorizeViewerType = {
  view_token: string;
};

type AuthorizeViewerProps = {
  link_id_input: string;
  email_input?: string;
  password_input?: string;
  ip: string | undefined;
  geo: string | undefined;
  ua: {
    isBot: boolean;
    ua: string;
    browser: {
      name?: string;
      version?: string;
    };
    device: {
      model?: string;
      type?: string;
      vendor?: string;
    };
    engine: {
      name?: string;
      version?: string;
    };
    os: {
      name?: string;
      version?: string;
    };
    cpu: {
      architecture?: string;
    };
  };
};

type ValidateEmailProps = {
  email: string;
  autocorrect: string;
  deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "UNKNOWN";
  quality_score: number;
  is_valid_format: {
    value: boolean;
    text: string;
  };
  is_free_email: {
    value: boolean;
    text: string;
  };
  is_disposable_email: {
    value: boolean;
    text: string;
  };
  is_role_email: {
    value: boolean;
    text: string;
  };
  is_catchall_email: {
    value: boolean;
    text: string;
  };
  is_mx_found: {
    value: boolean;
    text: string;
  };
  is_smtp_valid: {
    value: boolean;
    text: string;
  };
};

/* --------------------------------- SUCCESS RETURN FUNCTION -------------------------------- */

async function validateViewer(
  input_props: AuthorizeViewerProps,
  link_props: GetLinkProps
) {
  let error_message: string | undefined;

  // Validate if email is correct
  async function validateEmail(email_input?: string) {
    if (!email_input) return false;

    try {
      const res = await fetch(
        `https://emailvalidation.abstractapi.com/v1?api_key=${Deno.env.get(
          "ABSTRACT_API_KEY"
        )}&email=${email_input}`
      );

      const data = (await res.json()) as ValidateEmailProps;

      if (!data.is_valid_format.value) {
        error_message = "Invalid email. Please enter a valid email address";
        return false;
      }

      if (data.is_disposable_email.value) {
        error_message =
          "You appear to be using a disposable email address. Please use your actual email";
        return false;
      }

      if (data.deliverability == "DELIVERABLE") {
        return true;
      } else {
        error_message =
          "Apologies! This appears to be an undeliverable email address. Please use your real email";
        return false;
      }
    } catch (error) {
      console.warn(`Error validating email from api: ${error}`);

      const email_regex = new RegExp(
        /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
      );

      return email_regex.test(email_input);
    }
  }

  // Validate if password matches
  function validatePassword(password_input?: string) {
    if (!password_input) return false;

    return password_input === link_props.link_password;
  }

  // Validate is part of restricted domains
  function validateDomain(email_input?: string, domains?: string) {
    const splitEmail = email_input?.toLowerCase().split("@") ?? [];

    if (!domains) return true;

    if (splitEmail.length < 2) return false;

    const domain = splitEmail[1];

    const domains_list = domains.toLowerCase().split(",");

    return domains_list.some((part) => {
      if (part.includes("@")) {
        return part === email_input;
      }
      return domain.includes(part);
    });
  }

  /* -------------------------- EXECUTION BODY -------------------------- */

  if (
    link_props.is_email_required &&
    !(await validateEmail(input_props.email_input))
  ) {
    return { is_valid: false, error_message: error_message };
  }

  if (
    link_props.is_password_required &&
    !validatePassword(input_props.password_input)
  ) {
    return { is_valid: false, error_message: error_message };
  }

  if (
    link_props.is_domain_restricted &&
    !validateDomain(
      input_props.email_input,
      link_props.restricted_domains ?? undefined
    )
  ) {
    return { is_valid: false, error_message: error_message };
  }

  return { is_valid: true, error_message: error_message };
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

serve(async (req) => {
  const input_props = await req.json();

  const { link_id_input, email_input, ip, geo, ua } =
    input_props as AuthorizeViewerProps;

  console.log(`${link_id_input} | ${email_input} - Initiating viewer auth`);

  const { data: link_props, error } = await supabase
    .rpc("get_link_props", { link_id_input })
    .returns<GetLinkProps[]>()
    .maybeSingle();

  if (error || !link_props) {
    console.error(
      `${link_id_input} | ${email_input} - Error fetching link - ${error}`
    );
    return errorHandler(
      "Invalid or inactive link. Please contact the owner of the document"
    );
  }

  console.log(`${link_id_input} | ${email_input} - Fetched link props`);

  /* ------------------ INSERT VIEW LOG ----------------- */

  const { data: insert_view, error: insert_view_error } = await supabaseAdmin
    .from("tbl_views")
    .insert({
      link_id: link_id_input,
      viewer: email_input && email_input.length > 0 ? email_input : "Anonymous",
      ip: ip,
      geo: geo,
      ua: ua,
      is_authorized: false,
    })
    .select("view_id")
    .maybeSingle();

  if (insert_view_error || !insert_view || !insert_view.view_id) {
    console.error(
      `${link_id_input} | ${email_input} - Error inserting view log`
    );
    return errorHandler(
      "Authorization failed. Please contact the owner of the document"
    );
  }

  console.log(
    `${link_id_input} | ${email_input} - Inserted view log - ${insert_view.view_id}`
  );

  /* ------------------ CHECK IF DOCUMENT AND LINK ARE ACTIVE ----------------- */

  const { is_enabled, is_active } = link_props;

  if (!is_enabled || !is_active) {
    return errorHandler(
      "Invalid or inactive link. Please contact the owner of the document"
    );
  }

  /* -------------------------- CHECK FOR EXPIRATION -------------------------- */

  const { is_expiration_enabled, expiration_date } = link_props;

  if (is_expiration_enabled && expiration_date) {
    const expiration_date_obj = new Date(expiration_date);

    if (new Date() > expiration_date_obj) {
      return errorHandler(
        "This link has expired. Please contact the owner of the document"
      );
    }
  }

  console.log(`${link_id_input} | ${email_input} - Validated link props`);

  /* -------------------------- CHECK FOR AUTHORIZATION -------------------------- */

  const { is_valid, error_message } = await validateViewer(
    input_props,
    link_props
  );

  if (!is_valid) {
    return errorHandler(error_message);
  }

  console.log(
    `${link_id_input} | ${email_input} - Authorizing ${insert_view.view_id}`
  );

  const { data: authorize_data, error: authorize_error } = await supabaseAdmin
    .rpc("authorize_viewer", {
      view_id_input: insert_view.view_id,
    })
    .returns<AuthorizeViewerType>();

  if (authorize_error || !authorize_data) {
    console.error(
      `${link_id_input} | ${email_input} - Error in authorization RPC - ${JSON.stringify(
        authorize_error
      )}`
    );
    return errorHandler(
      "Could not authorize. Please contact the owner of the document"
    );
  }

  console.log(
    `${link_id_input} | ${email_input} - Authorized ${insert_view.view_id}`
  );

  return new Response(JSON.stringify(authorize_data), {
    headers: { "Content-Type": "application/json" },
  });
});
