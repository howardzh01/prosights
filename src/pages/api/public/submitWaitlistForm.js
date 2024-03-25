import sendgrid from "@sendgrid/mail";

export const config = {
  runtime: "edge",
};

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const handler = async (req) => {
  const { fullName, email, companyName } = await req.json();

  const message = `
      New waitlist sign-up:
      Full Name: ${fullName}
      Email: ${email}
      Company Name: ${companyName}
    `;

  const data = {
    personalizations: [{ to: [{ email: "info@prosights.co" }] }],
    from: { email: "alerts@prosights.co" },
    subject: `New Waitlist Sign-up - ${companyName}`,
    content: [{ type: "text/plain", value: message }],
  };

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error sending email: ${response.statusText}`);
    }
    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Error sending email" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export default handler;
