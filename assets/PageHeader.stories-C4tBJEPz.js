import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-0SYR6EyP.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./arrow-left-0NAnQ-dx.js";import{n as c,t as l}from"./button-DZ6vyP30.js";function u({title:e,backTo:t,backLabel:n=`Back`,actions:i}){return(0,d.jsxs)(`div`,{className:`sticky top-[var(--header-height)] z-30 -mx-4 mb-2 flex items-center gap-2 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur-sm`,children:[t&&(0,d.jsx)(l,{asChild:!0,variant:`ghost`,size:`icon`,className:`h-11 w-11 shrink-0`,children:(0,d.jsx)(r,{to:t,"aria-label":n,children:(0,d.jsx)(s,{size:18})})}),(0,d.jsx)(`h2`,{className:`font-display truncate text-base font-semibold`,children:e}),i&&(0,d.jsx)(`div`,{className:`ml-auto flex shrink-0 items-center gap-2`,children:i})]})}var d;function f(){return(f=e((()=>{t(),o(),c(),d=a(),u.__docgenInfo={description:`The shared sticky sub-header: back control + page title + optional actions, pinned directly
beneath the app header.

The offset is \`top: var(--header-height)\` — the same variable that sets the app header's box
height in \`routes/__root.tsx\`. That is the point of this widget: before it, each page hardcoded
its own pixel offset (\`top-[57px]\`) which silently drifted every time the header changed (F12,
#159). One variable now drives both sides, so they cannot disagree.

Prop-only (no store, no query) so every state renders from props in Storybook; the routes that
use it stay thin wiring (ADR-0017).`,methods:[],displayName:`PageHeader`,props:{title:{required:!0,tsType:{name:`string`},description:`Page title, truncated to one line so a long user-authored title can't push the actions out.`},backTo:{required:!1,tsType:{name:`string`},description:`Route the back control navigates to. Omit for a page that has no parent to return to.`},backLabel:{required:!1,tsType:{name:`string`},description:`Accessible name for the back control — say where it goes ("Back to events"), not just "Back".`,defaultValue:{value:`'Back'`,computed:!1}},actions:{required:!1,tsType:{name:`ReactNode`},description:`Trailing controls (edit/delete, a gear, …), rendered right-aligned. Supplied by the caller.`}}}})))()}var p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{i(),c(),f(),p=a(),{expect:m,fn:h}=__STORYBOOK_MODULE_TEST__,g=h(),_={title:`widgets/page-header/PageHeader`,component:u,decorators:[e=>(0,p.jsx)(`div`,{className:`mx-auto max-w-2xl px-4`,children:(0,p.jsx)(e,{})}),n],args:{title:`Training — Tuesday`}},v={play:async({canvas:e})=>{await m(e.getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument(),await m(e.queryByRole(`link`)).not.toBeInTheDocument()}},y={decorators:[e=>(0,p.jsx)(`div`,{style:{"--header-height":`80px`},children:(0,p.jsx)(e,{})})],play:async({canvas:e})=>{let t=e.getByRole(`heading`).parentElement;await m(getComputedStyle(t).top).toBe(`80px`)}},b={args:{backTo:`/`,backLabel:`Back to events`},play:async({canvas:e})=>{let t=e.getByRole(`link`,{name:`Back to events`});await m(t).toHaveAttribute(`href`,`/`),await m(e.getByRole(`heading`,{name:`Training — Tuesday`})).toBeInTheDocument()}},x={args:{backTo:`/`,backLabel:`Back to events`,actions:(0,p.jsx)(l,{variant:`outline`,size:`sm`,onClick:()=>g(),children:`Edit`})},play:async({canvas:e,userEvent:t})=>{g.mockClear(),await m(e.getByRole(`link`,{name:`Back to events`})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Edit`})),await m(g).toHaveBeenCalledTimes(1)}},S={args:{title:`Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam`,backTo:`/`,backLabel:`Back to events`},play:async({canvas:e})=>{await m(e.getByRole(`heading`)).toHaveClass(`truncate`)}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Training — Tuesday'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    '--header-height': '80px'
  } as React.CSSProperties}>
        <Story />
      </div>],
  play: async ({
    canvas
  }) => {
    const header = canvas.getByRole('heading').parentElement as HTMLElement;
    await expect(getComputedStyle(header).top).toBe('80px');
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    backTo: '/',
    backLabel: 'Back to events'
  },
  play: async ({
    canvas
  }) => {
    const back = canvas.getByRole('link', {
      name: 'Back to events'
    });
    await expect(back).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('heading', {
      name: 'Training — Tuesday'
    })).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    backTo: '/',
    backLabel: 'Back to events',
    actions: <Button variant="outline" size="sm" onClick={() => onAction()}>
        Edit
      </Button>
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    onAction.mockClear();
    await expect(canvas.getByRole('link', {
      name: 'Back to events'
    })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: 'Edit'
    }));
    await expect(onAction).toHaveBeenCalledTimes(1);
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Volleybalvereniging Heren 3 — thuiswedstrijd tegen de allerlangste clubnaam',
    backTo: '/',
    backLabel: 'Back to events'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading')).toHaveClass('truncate');
  }
}`,...S.parameters?.docs?.source}}},C=[`TitleOnly`,`StickyOffsetFollowsHeaderHeight`,`WithBack`,`WithBackAndActions`,`LongTitle`]})))()}w();export{S as LongTitle,y as StickyOffsetFollowsHeaderHeight,v as TitleOnly,b as WithBack,x as WithBackAndActions,C as __namedExportsOrder,_ as default};