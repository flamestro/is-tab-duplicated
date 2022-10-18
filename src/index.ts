import {v4 as uuidV4} from 'uuid';


const tabDuplicationHistoryKey = 'is-tab-duplicated:duplication-history'
const tabIdKey = 'is-tab-duplicated:tab-id'

interface ITabId {
    id: string;
}

interface ITabHistoryEntry {
    tabId: string;
}


const putTabHistory = (tabHistoryEntry: ITabHistoryEntry) => {
    const tabHistory = sessionStorage.getItem(tabDuplicationHistoryKey);

    const isCurrentTabIdKnown = () => {
        if (!tabHistory) {
            return false;
        }
        return (
            JSON.parse(tabHistory).filter(
                (entry: ITabHistoryEntry) => entry.tabId === tabHistoryEntry.tabId,
            ).length !== 0
        );
    };

    const putTabHistoryEntryInHistory = (entry: ITabHistoryEntry) => {
        if (!tabHistory) {
            sessionStorage.setItem(tabDuplicationHistoryKey, JSON.stringify([entry]));
        } else {
            sessionStorage.setItem(
                tabDuplicationHistoryKey,
                JSON.stringify([...JSON.parse(tabHistory), entry]),
            );
        }
    };

    if (!isCurrentTabIdKnown()) {
        putTabHistoryEntryInHistory(tabHistoryEntry);
    }
};

export class TabId {
    private static instance: ITabId | undefined;

    private constructor() {}

    private static generateTabId() {
        return uuidV4();
    }

    private static saveTabIdToSessionStorage(tabId: string) {
        sessionStorage.setItem(tabIdKey, tabId);
    }

    private static failOnMissingSessionStorage() {
        if (!navigator.cookieEnabled || !sessionStorage) {
            throw new Error('sessionStorage needs to be enabled to handle duplicated tabs')
        }
    }

    private static clearTabIdFromSessionStorage() {
        return sessionStorage.removeItem(tabIdKey);
    }

    private static getTabIdFromSessionStorage() {
        return sessionStorage && sessionStorage.getItem(tabIdKey);
    }

    public static initInstance() {
        this.failOnMissingSessionStorage();

        const tabId = this.getTabIdFromSessionStorage();
        if (tabId) {
            TabId.instance = { id: tabId };
            this.clearTabIdFromSessionStorage();
        } else {
            TabId.instance = { id: this.generateTabId() };
        }
        putTabHistory({
            tabId: (TabId.getInstance() as ITabId).id as string,
        });

        let visibility = {
            'visibilitychangehide': false,
            'pagehide': false,
            'blur': false,
        }

        document.addEventListener('visibilitychange', (event) => {
            if (document.visibilityState === 'visible') {
                visibility.visibilitychangehide = false
                this.clearTabIdFromSessionStorage();
            } else {
                visibility.visibilitychangehide = true
                if(!visibility.pagehide && !visibility.blur && visibility.visibilitychangehide){
                    this.saveTabIdToSessionStorage(
                        (TabId.instance as ITabId).id as string,
                    );
                }
            }
        });

        document.addEventListener('pagehide', () => {
            visibility.pagehide = true
        });

        document.addEventListener('pageshow', () => {
            visibility.pagehide = false
        });

        window.addEventListener('blur', () => {
            visibility.blur = true
        });

        window.addEventListener('focus', () => {
            visibility.blur = false
        });
    }

    public static getInstance(): ITabId | undefined {
        return TabId.instance;
    }

    public static isTabDuplicated(): boolean {
        if (!sessionStorage || sessionStorage.getItem(tabDuplicationHistoryKey) === null) {
            return false;
        }
        const tabHistory = JSON.parse(sessionStorage.getItem(tabDuplicationHistoryKey) as string);
        return tabHistory.length > 1;
    }
}
