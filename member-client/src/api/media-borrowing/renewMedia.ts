import { BorrowingResponse } from "./types/BorrowingResponse";

export const renewMedia = async (mediaId: number, renewedEndDate: Date) : Promise<BorrowingResponse> => {
    if (process.env.NODE_ENV === 'development') {
        return { success: true, errors: [] };
    }

    const response = await fetch(`/api/media-borrowing/renew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId, renewedEndDate }),
    });

    if (response.ok) {
        return { success: true, errors: [] };
    } else {
        const body = await response.json();
        return { success: false, errors: body.errors };
    }
}