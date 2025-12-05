import imap from 'imap-simple';
import { simpleParser } from 'mailparser';

import dotenv from 'dotenv';

dotenv.config();

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS, 
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: {               
            rejectUnauthorized: false
        }
    }
};

export const recieveEmail = async () => {

    try {

        const connection = await imap.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = [['HEADER','SUBJECT','Ref:']];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        console.log(`Found ${messages.length} new emails.`);

        const parsedEmails = [];

        for (const item of messages) {
            
            const bodyPart = item.parts.find(part => part.which === '');
            
            if (bodyPart) {
                const id = item.attributes.uid;
                
                const parsed = await simpleParser(bodyPart.body);
                
                const subject = parsed.subject;
                const fromEmail = parsed.from.value[0].address; 
                const textBody = parsed.text; 

                if (subject && subject.includes("Ref:")) {
                    const match = subject.match(/Ref:([a-f0-9]{24})/);
                    
                    if (match && match[1]) {
                        parsedEmails.push({
                            rfpId: match[1],
                            vendorEmail: fromEmail,
                            text: textBody,
                            subject: subject
                        });
                    }
                }
            }
        }

        
        await connection.end();

        return parsedEmails;
        
    } catch (error) {
        console.log('Error receiving email:', error);
    }

}