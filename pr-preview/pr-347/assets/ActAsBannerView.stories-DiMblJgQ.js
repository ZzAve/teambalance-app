import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-CKd6OPi-.js";import{n as i,t as a}from"./button-W1GRNbO0.js";function o({teamName:e,isExiting:t,onExit:n}){return e?(0,s.jsxs)(`div`,{role:`status`,"aria-label":`Acting as the platform`,className:`flex flex-wrap items-center justify-between gap-3 border-b border-gold/40 bg-gold/15 px-5 py-2`,children:[(0,s.jsxs)(`p`,{className:`text-sm`,children:[`Acting as the platform inside `,(0,s.jsx)(`span`,{className:`font-semibold`,children:e})]}),(0,s.jsx)(a,{size:`sm`,variant:`outline`,disabled:t,onClick:n,children:`Exit`})]}):null}var s;function c(){return(c=e((()=>{i(),s=t(),o.__docgenInfo={description:`The persistent act-as banner (ADR-0024 §4). The team name is **load-bearing, not decoration**:
twelve near-identically-named club squads is the exact condition under which a season gets prepped
into the wrong one, and this line is the only thing standing between the operator and that.

Presentational: the grant and the exit mutation live in the container, so every state here is a
no-network story (ADR-0017).`,methods:[],displayName:`ActAsBannerView`,props:{teamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Team the Platform Admin is currently inside; null renders nothing at all.`},isExiting:{required:!1,tsType:{name:`boolean`},description:``},onExit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),c(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p={title:`features/act-as/ActAsBannerView`,component:o,args:{teamName:`Tovo Dames 5`,onExit:d()}},m={play:async({canvas:e})=>{await u(e.getByRole(`status`,{name:`Acting as the platform`})).toHaveTextContent(`Tovo Dames 5`),await u(e.getByRole(`button`,{name:`Exit`})).toBeEnabled()}},h={render:e=>(0,l.jsx)(r,{items:{Exiting:(0,l.jsx)(o,{...e,isExiting:!0}),"Not acting as":(0,l.jsx)(o,{...e,teamName:null})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Exiting`).getByRole(`button`,{name:`Exit`})).toBeDisabled(),await u(t(`Not acting as`).queryByRole(`status`)).not.toBeInTheDocument(),await u(t(`Not acting as`).queryByRole(`button`,{name:`Exit`})).not.toBeInTheDocument()}},g={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Exit`})),await u(n.onExit).toHaveBeenCalled()}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('status', {
      name: 'Acting as the platform'
    })).toHaveTextContent('Tovo Dames 5');
    await expect(canvas.getByRole('button', {
      name: 'Exit'
    })).toBeEnabled();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Exiting: <ActAsBannerView {...args} isExiting />,
    // Not acting as anyone: nothing at all, so an ordinary Member never sees a banner-shaped gap.
    'Not acting as': <ActAsBannerView {...args} teamName={null} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Exiting').getByRole('button', {
      name: 'Exit'
    })).toBeDisabled();
    await expect(region('Not acting as').queryByRole('status')).not.toBeInTheDocument();
    await expect(region('Not acting as').queryByRole('button', {
      name: 'Exit'
    })).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Exit'
    }));
    await expect(args.onExit).toHaveBeenCalled();
  }
}`,...g.parameters?.docs?.source}}},_=[`Data`,`Shells`,`Interactions`]})))()}v();export{m as Data,g as Interactions,h as Shells,_ as __namedExportsOrder,p as default};