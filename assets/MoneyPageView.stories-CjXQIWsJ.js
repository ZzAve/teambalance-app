import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-DnPB3fG0.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./MoneyPoolView-CD8sHjJE.js";import{n as o,r as s}from"./app-shell-decorator-CArRzp9h.js";function c({pool:e}){return(0,l.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,l.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Money`}),e]})}var l;function u(){return(u=e((()=>{l=r(),c.__docgenInfo={description:`The Money tab laid out (ADR-0032 §3): the page title over the team's money pool.`,methods:[],displayName:`MoneyPageView`,props:{pool:{required:!0,tsType:{name:`ReactNode`},description:`The money pool — the live container in the route, the prop-only View in a story.`}}}})))()}var d,f,p,m,h,g;function _(){return(_=e((()=>{i(),s(),n(),u(),d=r(),{expect:f}=__STORYBOOK_MODULE_TEST__,p=o(`money`),m={title:`pages/money/MoneyPageView`,component:c,parameters:p.parameters,decorators:p.decorators,args:{pool:(0,d.jsx)(a,{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,beerPrice:270,beerCount:69,payments:[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}]})}},h={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await f(e.getByRole(`heading`,{name:`Money`})).toBeInTheDocument(),await f(e.getByText(`Lisa de Vries`)).toBeInTheDocument(),await f(e.getByText(`69 beers`)).toBeInTheDocument(),await f(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      modes: pageModes
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Money'
    })).toBeInTheDocument();
    await expect(canvas.getByText('Lisa de Vries')).toBeInTheDocument();
    await expect(canvas.getByText('69 beers')).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,...h.parameters?.docs?.source}}},g=[`Data`]})))()}_();export{h as Data,g as __namedExportsOrder,m as default};