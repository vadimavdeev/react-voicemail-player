<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [react-voicemail-player](./react-voicemail-player.md) &gt; [VoicemailPlayerProps](./react-voicemail-player.voicemailplayerprops.md) &gt; [children](./react-voicemail-player.voicemailplayerprops.children.md)

## VoicemailPlayerProps.children property

A function that renders <audio> element

**Signature:**

```typescript
children: (ref: React.RefCallback<HTMLAudioElement>) => React.ReactElement;
```

## Example


```ts
<VoicemailPlayer>{(ref) => <audio ref={ref} />}</VoicemailPlayer>
```

