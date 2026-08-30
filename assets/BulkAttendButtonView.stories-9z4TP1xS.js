import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./BulkAttendButtonView-BDEI_Kz2.js";var r,i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),{expect:r,fn:i,within:a}=__STORYBOOK_MODULE_TEST__,o={title:`features/bulk-attend/BulkAttendButtonView`,component:n,args:{count:3,onAttend:i()}},s={args:{count:0},play:async({canvasElement:e})=>{await r(a(e).queryByRole(`button`)).not.toBeInTheDocument()}},c={play:async({canvas:e})=>{await r(e.getByRole(`button`,{name:/Attend 3 events/})).toBeInTheDocument()}},l={args:{count:1},play:async({canvas:e})=>{await r(e.getByRole(`button`,{name:`Attend 1 event`})).toBeInTheDocument()}},u={args:{count:4,typeName:`Training`},play:async({canvas:e})=>{await r(e.getByRole(`button`,{name:`Attend 4 trainings`})).toBeInTheDocument()}},d={args:{isPending:!0},play:async({canvas:e})=>{await r(e.getByRole(`button`,{name:/Attend 3 events/})).toBeDisabled()}},f={play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:/Attend 3 events/})),await r(t.onAttend).toHaveBeenCalled()}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    count: 0
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: /Attend 3 events/
    })).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    count: 1
  },
  play: async ({
    canvas
  }) => {
    // Singular noun, so the label never reads "Attend 1 events".
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 event'
    })).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    count: 4,
    typeName: 'Training'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 4 trainings'
    })).toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    // Disabled while the batch is in flight, so a double-tap can't fire it twice.
    await expect(canvas.getByRole('button', {
      name: /Attend 3 events/
    })).toBeDisabled();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Attend 3 events/
    }));
    await expect(args.onAttend).toHaveBeenCalled();
  }
}`,...f.parameters?.docs?.source}}},p=[`Hidden`,`WithCount`,`SingleEvent`,`SingleType`,`Pending`,`TapFiresOnAttend`]})))()}m();export{s as Hidden,d as Pending,l as SingleEvent,u as SingleType,f as TapFiresOnAttend,c as WithCount,p as __namedExportsOrder,o as default};