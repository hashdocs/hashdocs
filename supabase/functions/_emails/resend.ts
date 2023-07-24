export interface email_props_type {
  from?: string;
  to: string[];
  subject: string;
  html: string;
}

export async function resend_email(email_props: email_props_type) {
  const { to, from, subject, html } = email_props;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get(`RESEND_API_KEY`)}`,
    },
    body: JSON.stringify({
      from: from ?? "Bharat from Hashdocs <bharat@hashdocs.org>",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  return data;
}
