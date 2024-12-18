import { BorrowingResponse } from "./types/BorrowingResponse";

export const renewMedia = async (mediaBorrowingRecordId: number, renewedEndDate: Date) : Promise<BorrowingResponse> => {
    if (process.env.NODE_ENV === 'development') {
        return { success: true, errors: [] };
    }

    const response = await fetch(`${import.meta.env.VITE_MEDIA_BORROWING_API_URL}/renew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaBorrowingRecordId, renewedEndDate }),
    });

    if (response.ok) {
        return { success: true, errors: [] };
    } else {
        const body = await response.json();
        return { success: false, errors: body.errors };
    }
}