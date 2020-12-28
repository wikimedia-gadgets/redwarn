# RedWarn Language Packs

In case you want to create your own language pack, you'll want to copy the `RWLEnglish.ts` file (as a basis), along with the `RedWarnLanguage.ts` file (as a backbone). `RedWarnLanguage.ts` defines the structure of each language pack, while `RWLEnglish.ts` serves as a fully-populated list of keys that you can use as a basis when translating.

## Creating

A language pack has the following signature:

```js
if (window.RedWarnLanguages == null) window.RedWarnLanguages = [];

window.RedWarnLanguages.push({
    // Pack data...
});
```

Where the object being pushed into `RedWarnLanguages` is a `RedWarnLanguage`, as defined by the file of the same name.

Having the correct tag is important, since RedWarn will use the language tag as a fallback in case the proper language file cannot be read or found.

## Compiling

Once you've finished translating the strings, you'll need to use TypeScript in order to turn the pack into a JavaScript file. Once converted, you may then insert this into your `common.js` file **before RedWarn** to load the new pack.

The English pack is unique since this is the only language pack preloaded with RedWarn, no matter which installation. Because of this, the English pack can be loaded from within RedWarn itself. As for other packs however, they must be loaded before RedWarn, and are referenced in the configuration file.

## Testing

Still working on this part. Check back later.
