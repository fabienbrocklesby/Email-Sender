import { serve } from "@hono/node-server";
import { Hono } from "hono";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();
const port = process.env.PORT || 3000;

app.post("/send-email", async (c) => {
	try {
		const { to, subject, text, fromName, senderEmail } =
			await c.req.parseBody();

		let transporter = nodemailer.createTransport({
			host: "smtp.mail.me.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.ICLOUD_EMAIL,
				pass: process.env.ICLOUD_PASSWORD,
			},
		});

		let mailOptions = {
			from: `"${fromName}" ${senderEmail}`,
			to: to,
			subject: subject,
			text: text,
		};

		let info = await transporter.sendMail(mailOptions);
		console.log(`Email sent: ${info.messageId}`);

		return c.json({ message: "Email sent successfully", info: info }, 200);
	} catch (error) {
		console.error("Failed to send email:", error);
		return c.json(
			{ message: "Failed to send email", error: error.message },
			500
		);
	}
});

serve({
	fetch: app.fetch,
	port,
});

console.log(`Server running on port ${port}`);
