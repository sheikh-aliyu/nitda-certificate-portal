interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// This is a mock email service.
// In a real application, you would use a library like nodemailer to send emails.
// For now, we will just log the email to the console.
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    console.log('--- Sending Email ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.html}`);
    console.log('---------------------');
    // In a real implementation, you would have something like:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from: 'from@example.com', ...options });
};
