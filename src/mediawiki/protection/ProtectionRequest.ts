import { Page, ProtectionLevel, ProtectionRequestTarget } from "..";

interface ProtectionRequest {
    page: Page;
    target: ProtectionRequestTarget;
    level: ProtectionLevel;
    reason?: string;
}

export default ProtectionRequest;
