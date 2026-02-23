import { useState } from "react";

export default function ChallengeCard({ challenge, onSubmit, submissionStatus}) {
    const [proofFile, setProofFile]= useState(null);
    const[note, setNote] = useState("");
    const[isSubmitting, setIsSubmitting]= useState(false);
    const[error, setError]= useState(null);
    const[success, setSuccess]= useState(false);

    const handleSubmit = async() => {
        if (!proofFile && !note) {
            setError("Please uplad a proof of image or add a short note.");
            return;
        }
        
        setError(null);
        setIsSubmitting(true);

        try{
            const fromData= new FormData();
            FormData.append("challenge_id")
        }
    }
}