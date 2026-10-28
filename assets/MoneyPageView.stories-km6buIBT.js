import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./iframe-BBRdzbA7.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./MoneyPoolView-CfIjIQQv.js";import{n as o,t as s}from"./button-AKCGabB4.js";import{n as c,r as l}from"./app-shell-decorator-CY1EMVrr.js";function u({pool:e}){return(0,d.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,d.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Money`}),e]})}var d;function f(){return(f=e((()=>{d=r(),u.__docgenInfo={description:`The Money tab laid out (ADR-0032 §3): the page title over the team's money pool.`,methods:[],displayName:`MoneyPageView`,props:{pool:{required:!0,tsType:{name:`ReactNode`},description:`The money pool — the live container in the route, the prop-only View in a story.`}}}})))()}var p,m,h,g,_,v;function y(){return(y=e((()=>{o(),i(),l(),n(),f(),p=r(),{expect:m}=__STORYBOOK_MODULE_TEST__,h=c(`money`),g={title:`pages/money/MoneyPageView`,component:u,parameters:h.parameters,decorators:h.decorators,args:{pool:(0,p.jsx)(a,{state:`Connected`,isLoading:!1,isError:!1,isAdmin:!1,balance:18750,beerPrice:270,beerCount:69,canTopUp:!0,topUp:(0,p.jsx)(s,{size:`lg`,children:`Top up`}),payments:[{date:`2026-10-06`,name:`Lisa de Vries`,amount:2e3,direction:`In`},{date:`2026-10-04`,name:`Sporthal De Kuil`,amount:4500,direction:`Out`},{date:`2026-09-29`,name:`Tom Bakker`,amount:1e3,direction:`In`}]})}},_={parameters:{chromatic:{modes:t}},play:async({canvas:e})=>{await m(e.getByRole(`heading`,{name:`Money`})).toBeInTheDocument(),await m(e.getByText(`Lisa de Vries`)).toBeInTheDocument(),await m(e.getByText(`69 beers`)).toBeInTheDocument(),await m(e.getByRole(`button`,{name:`Top up`})).toBeInTheDocument(),await m(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`)}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByRole('button', {
      name: 'Top up'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveAttribute('aria-current', 'page');
  }
}`,..._.parameters?.docs?.source}}},v=[`Data`]})))()}y();export{_ as Data,v as __namedExportsOrder,g as default};