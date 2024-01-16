# is-tab-duplicated

[![Npm package version](https://badgen.net/npm/v/is-tab-duplicated)](https://npmjs.com/package/is-tab-duplicated)
[![Npm package yearly downloads](https://badgen.net/npm/dm/is-tab-duplicated)](https://npmjs.com/package/is-tab-duplicated)
[![Npm package license](https://badgen.net/npm/license/is-tab-duplicated)](https://npmjs.com/package/is-tab-duplicated)

This package allows you to determine if a tab is duplicated.

It does so by merging multiple browser events and getting the intersection of their definitions that falls under the
same category as duplication of tabs.

It does not cover 100% of all duplication cases and can deliver false-positives in some edge cases, but it covers most
of the normal user flows.

## Introduction

This library depends on strongly on sessionStorage and throws an error if it is not available.

It also depends on the following events being fired in the browser:

- `document.visibilitychange`
- `document.pagehide`
- `document.pageshow`
- `window.blur`
- `window.focus`

The idea is as follows: Every tab that runs your application will get a unique uuid. This will be stored in a TabId
instance.

In addition to that a history of tabId's will be stored in the session storage.
This history is not exposed via an api and the format might change over time.

## Install

```
npm install --save is-tab-duplicated

or

yarn add is-tab-duplicated
```

## Usage

There are three functionalities in this library.

1. `initInstance()` - This needs to be called exactly once per page load
2. `isTabDuplicated()` - This returns true if the tab is duplicated
3. `getInstance().id` - This returns the unique tabId

### Example (React)

This example is in React, but it can be used in any other framework or vanilla javascript.

```typescript
import TabId from "is-tab-duplicated";

// some code
useEffect(() => {
    TabId.initInstance();
    if (TabId.isTabDuplicated()) {
        console.log('This is a duplicated tab');
    }
}, [])
// some code
```