import { getBlob, getMetadata, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/services/firebase";
import { logEvent } from "@/services/firebase/log";

export async function uploadMentorResume(file: File, uid: string) {
    try {
        const resumeRef = ref(
            storage,
            `/resumes/${uid}-mentor-resume${file.name.substring(
                file.name.lastIndexOf(".")
            )}`
        );
        const snap = await uploadBytes(resumeRef, file, {
            customMetadata: { owner: uid },
        });
        return snap.ref.toString();
    } catch (e) {
        logEvent("error", {
            event: "upload_mentor_resume_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        throw e;
    }
}

export async function uploadGeneralResume(file: File, uid: string) {
    try {
        const resumeRef = ref(
            storage,
            `/resumes/${uid}-general-resume${file.name.substring(
                file.name.lastIndexOf(".")
            )}`
        );
        const snap = await uploadBytes(resumeRef, file, {
            customMetadata: { owner: uid },
        });
        return snap.ref.toString();
    } catch (e) {
        logEvent("error", {
            event: "upload_general_resume_error",
            message: (e as Error).message,
            name: (e as Error).name,
            stack: (e as Error).stack,
        });
        throw e;
    }
}

export async function getResume(gs: string) {
    const gsRef = ref(storage, gs);
    try {
        const metadata = await getMetadata(gsRef);
        const blob = await getBlob(gsRef);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = metadata.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        logEvent("error", {
            event: "get_resume_error",
        });
    }
}

export async function getResumeURL(gs: string) {
    const gsRef = ref(storage, gs);
    try {
        const blob = await getBlob(gsRef);
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    } catch (e) {
        logEvent("error", {
            event: "get_resume_error",
        });
    }
}
