import { Page, ProtectionLevel } from "..";

export enum ProtectionDuration {
    Temporary,
    Indefinite,
}

interface ProtectionRequest {
    page: Page;
    level: ProtectionLevel;
    reason?: string;
    additionalInformation?: string;
    duration: ProtectionDuration;
}

export default ProtectionRequest;
