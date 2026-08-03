// ---------------------------------------------------------------------------
// The backend groups files under a document "bundle" (type: NATIONAL_ID,
// BLUEBOOK, ...), with each bundle holding up to two files per side while a
// re-upload is in flight (see DriverDocument's `files` comment — the stale
// isActive:false entry is swept at midnight). The table in the reference
// design renders one row per *file*, independently statused ("Bluebook
// Front" Rejected while "Bluebook Back" could be Approved) — so a bundle
// with N active files becomes N rows here, not one.
// ---------------------------------------------------------------------------

import { DriverDocument, DriverDocumentFile } from 'graphql/queries/drivers.queries';

export type DriverDocumentFileRow = {
    id: string; // = file._id — this is what approve/reject mutations key off
    documentId: string; // parent bundle _id — not needed by the mutations
    // (they only take documentFileId), but useful for cache updates /
    // refetch scoping later.
    label: string; // e.g. "Bluebook Front"
    uploaded: string; // file.createdAt
    status: DriverDocumentFile['status'];
    // NOTE on naming: the resolver reassigns `s3Key` to a presigned VIEW url
    // before it reaches the client (see getViewUrl in the resolver) — it is
    // not the raw storage key by the time it's here. `downloadUrl` is a
    // separate presigned url with a Content-Disposition filename attached,
    // meant for the Download button, not for rendering inline. Aliasing both
    // to clearer names at this boundary so nothing downstream has to know
    // the backend's field is misleadingly named.
    viewUrl?: string; // <- file.s3Key
    downloadUrl?: string; // <- file.downloadUrl
    // Prefers the file-level reason once the backend adds one; falls back to
    // the bundle-level reason in the meantime. Once DriverDocumentFile gets
    // its own rejectionReason field, this starts returning the accurate
    // per-file value with no other change needed here.
    rejectionReason: string | null;
};

function humanize(value: string): string {
    // ENUM_STYLE -> "Enum Style"
    return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function flattenDriverDocuments(documents: DriverDocument[]): DriverDocumentFileRow[] {
    return documents.flatMap((doc) =>
        doc.files
            .filter((file) => file.isActive)
            .map((file) => ({
                id: file._id,
                documentId: doc._id,
                label: `${humanize(doc.type)} ${humanize(file.side)}`,
                uploaded: file.createdAt,
                status: file.status,
                viewUrl: file.s3Key,
                downloadUrl: file.downloadUrl,
                rejectionReason: (file as DriverDocumentFile & { rejectionReason?: string | null }).rejectionReason ?? doc.rejectionReason
            }))
    );
}
