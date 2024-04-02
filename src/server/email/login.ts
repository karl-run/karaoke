import { Resend } from 'resend';

let resend: Resend | null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);

  return resend;
}

export async function sendLoginLink(email: string, token: string) {
  const base64Email = Buffer.from(email).toString('base64');
  const comboToken = `${token}.${base64Email}`;
  const loginUrl = `https://karaoke.karl.run/login/magic-link?token=${comboToken}`;

  const resend = await getResend().emails.send({
    from: 'login@badstu.karl.run',
    to: email,
    subject: 'Login to Karaoke Match',
    html: `
          <h3>Your login link to Karaoke Match</h3>
          <br/>
          <a href="${loginUrl}">${loginUrl}</a>
          <br/>
          <p>This is a one time link that will expire in 10 minutes.</p>
        `,
  });

  if (resend.error) {
    throw new Error(`Resend errored: ${resend.error.name}, ${resend.error.message}`);
  }
}
