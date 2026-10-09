import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./PhotoPicker-lmBY6WBe.js";async function r(){let e=document.createElement(`canvas`);e.width=400,e.height=300;let t=e.getContext(`2d`);t.fillStyle=`#2f6f4f`,t.fillRect(0,0,400,300),t.fillStyle=`#f2c14e`,t.fillRect(150,100,100,100);let n=await new Promise(t=>e.toBlob(e=>t(e),`image/png`));return new File([n],`me.png`,{type:`image/png`})}var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),{expect:i,fn:a,screen:o,userEvent:s,waitFor:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`features/pick-photo/PhotoPicker`,component:n,args:{label:`Upload photo`,onPicked:a()}},d={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,args:t})=>{let n=e.getByLabelText(`Upload photo`);await s.upload(n,await r());let a=l(await o.findByRole(`dialog`));await s.click(a.getByRole(`button`,{name:`Cancel`})),await c(()=>i(o.queryByRole(`dialog`)).not.toBeInTheDocument()),await i(t.onPicked).not.toHaveBeenCalled(),await s.upload(n,await r());let u=l(await o.findByRole(`dialog`)).getByRole(`button`,{name:`Use photo`});await c(()=>i(u).toBeEnabled()),await s.click(u),await c(()=>i(t.onPicked).toHaveBeenCalledOnce());let d=t.onPicked.mock.calls[0][0];await i(d.type).toBe(`image/webp`);let f=await createImageBitmap(d);await i([f.width,f.height]).toEqual([256,256]),await c(()=>i(o.queryByRole(`dialog`)).not.toBeInTheDocument())}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    args
  }) => {
    const input = canvas.getByLabelText('Upload photo');

    // Cancel leaves nothing picked.
    await userEvent.upload(input, await landscapePicture());
    const first = within(await screen.findByRole('dialog'));
    await userEvent.click(first.getByRole('button', {
      name: 'Cancel'
    }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onPicked).not.toHaveBeenCalled();
    await userEvent.upload(input, await landscapePicture());
    const dialog = within(await screen.findByRole('dialog'));
    const use = dialog.getByRole('button', {
      name: 'Use photo'
    });
    await waitFor(() => expect(use).toBeEnabled());
    await userEvent.click(use);
    await waitFor(() => expect(args.onPicked).toHaveBeenCalledOnce());
    const photo: Blob = (args.onPicked as ReturnType<typeof fn>).mock.calls[0][0];
    await expect(photo.type).toBe('image/webp');
    const bitmap = await createImageBitmap(photo);
    await expect([bitmap.width, bitmap.height]).toEqual([256, 256]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
}`,...d.parameters?.docs?.source}}},f=[`Interactions`]})))()}p();export{d as Interactions,f as __namedExportsOrder,u as default};