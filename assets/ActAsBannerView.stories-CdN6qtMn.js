import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-Cx-o6bpy.js";function i({teamName:e,isExiting:t,onExit:n}){return e?(0,a.jsxs)(`div`,{role:`status`,"aria-label":`Acting as the platform`,className:`flex flex-wrap items-center justify-between gap-3 border-b border-gold/40 bg-gold/15 px-5 py-2`,children:[(0,a.jsxs)(`p`,{className:`text-sm`,children:[`Acting as the platform inside `,(0,a.jsx)(`span`,{className:`font-semibold`,children:e})]}),(0,a.jsx)(r,{size:`sm`,variant:`outline`,disabled:t,onClick:n,children:`Exit`})]}):null}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:`The persistent act-as banner (ADR-0024 §4). The team name is **load-bearing, not decoration**:
twelve near-identically-named club squads is the exact condition under which a season gets prepped
into the wrong one, and this line is the only thing standing between the operator and that.

Presentational: the grant and the exit mutation live in the container, so every state here is a
no-network story (ADR-0017).`,methods:[],displayName:`ActAsBannerView`,props:{teamName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The Team the Platform Admin is currently inside; null renders nothing at all.`},isExiting:{required:!1,tsType:{name:`boolean`},description:``},onExit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{o(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`features/act-as/ActAsBannerView`,component:i,args:{teamName:`Tovo Dames 5`,onExit:c()}},u={play:async({canvas:e})=>{await s(e.getByRole(`status`,{name:`Acting as the platform`})).toHaveTextContent(`Tovo Dames 5`),await s(e.getByRole(`button`,{name:`Exit`})).toBeEnabled()}},d={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:`Exit`})),await s(n.onExit).toHaveBeenCalled()}},f={args:{isExiting:!0},play:async({canvas:e})=>{await s(e.getByRole(`button`,{name:`Exit`})).toBeDisabled()}},p={args:{teamName:null},play:async({canvas:e})=>{await s(e.queryByRole(`status`)).not.toBeInTheDocument(),await s(e.queryByRole(`button`,{name:`Exit`})).not.toBeInTheDocument()}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    isExiting: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Exit'
    })).toBeDisabled();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    teamName: null
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: 'Exit'
    })).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m=[`NamesTheTeam`,`ExitIsOneClick`,`Exiting`,`NotActingAs`]})))()}h();export{d as ExitIsOneClick,f as Exiting,u as NamesTheTeam,p as NotActingAs,m as __namedExportsOrder,l as default};