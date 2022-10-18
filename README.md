# is-tab-duplicated
This package allows you to determine if a tab is duplicated. 

It does so by merging multiple browser events and getting the intersection of their definitions that falls under the same category as duplication of tabs.
It does not cover 100% of all duplication cases and can deliver false-positives in some edge cases, but it covers most of the normal user flows.

# Good to Know
This library depends on the sessionStorage and throws an error if it is not initialized.

It also depends on the following events being fired:
- document.visibilitychange
- document.pagehide
- document.pageshow
- window.blur
- window.focus

Every tab that runs your application will get a unique uuid. This will be stored in an instance. It is exposed via an api.
In addition to that a history of tabId's will be stored in the session storage. This history is not exposed via an api.

# Install

`npm install --save is-tab-duplicated`

or

`yarn add is-tab-duplicated`

# Usage

There are three relevant methods in this library.
1. initInstance()
2. isTabDuplicated()
3. getInstance().id

You need to call `TabId.initInstance()` once per page load. It should not be called more than once. 

Afterwards you can call `TabId.isTabDuplicated()` to see if the page is duplicated or `TabId.getInstance().id` to get the tabId

```typescript
import TabId from "is-tab-duplicated";

...

    useEffect(() => {
        TabId.initInstance();
        if(TabId.isTabDuplicated()) {
            console.log('This is a duplicated tab');
        }
    }, [])
```