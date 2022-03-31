import { Page, UserAccount } from "app/mediawiki";
import Log from "app/data/RedWarnLog";

interface ClientUserCache {
    groups?: string[];
}

/**
 * The ClientUser represents the UserAccount object of the currently logged-in
 * user. The ClientUser also introduces methods specific only to the
 * logged-in user.
 *
 * To use the ClientUser, call {@link ClientUser.i}.
 */
export class ClientUser extends UserAccount {
    /**
     * The currently-logged in user's ClientUser singleton. Use this for all
     * ClientUser activity.
     */
    public static readonly i = new ClientUser();

    /**
     * The user's RedWarn configuration file.
     */
    public get redwarnConfigPage(): Page {
        return (
            this._redwarnConfigPage ??
            (this._redwarnConfigPage = this.getUserSubpage("redwarnConfig.js"))
        );
    }
    public _redwarnConfigPage: Page;

    /**
     * This class cannot be constructed outside of this class.
     * @private
     */
    private constructor() {
        // Username is always the logged-in user.
        super(mw.user.getName());

        if (ClientUser.i != null)
            throw "Attempt made to reconstruct existing ClientUser.";
    }

    public async init(): Promise<void> {
        Log.debug("Initializing ClientUser...");
        // Run all requests "parallel".
        await Promise.all([this.getGroups()]);
    }

    /**
     * The private cache for this ClientUser. Used to store groups.
     * @private
     */
    private readonly clientUserCache: ClientUserCache = {};

    /**
     * Gets the user's groups.
     */
    async getGroups(): Promise<string[]> {
        if (!this.clientUserCache.groups) {
            this.clientUserCache.groups = await mw.user.getGroups();
        }
        return this.clientUserCache.groups;
    }

    /**
     * Checks if the user is part of a user group.
     * @param group The group to check for. Since this cannot be `autoconfirmed`,
     * use `confirmed` instead.
     */
    inGroup(group: Exclude<string, "autoconfirmed">): boolean {
        const groups = this.clientUserCache.groups;

        // Scenario 1: The group is found.
        if (groups.includes(group)) return true;

        // Scenario 2: The user is `confirmed` but not `autoconfirmed`.
        // Collapsed `if` into one `return` for ease.
        return group === "confirmed" && groups.includes("autoconfirmed");
    }
}
