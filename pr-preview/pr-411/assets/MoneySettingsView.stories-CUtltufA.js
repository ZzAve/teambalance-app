import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-B6ffpKAe.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-BqTmlbIE.js";import{n as s,t as c}from"./input-CD0kqAVw.js";import{n as l,t as u}from"./label-Vf1FVk_5.js";import{n as d,t as f}from"./switch-C4KeThMR.js";function p(e){let t=e.trim();if(t===``)return;if(!y.test(t))return NaN;let n=Math.round(Number(t.replace(`,`,`.`))*100);return n>=1&&n<=v?n:NaN}function m(e){return e===void 0?``:(e/100).toFixed(2).replace(`.`,`,`)}function h(e){let t=e.trim();return t===``||b.test(t)?null:`Use a link like https://bunq.me/yourteam.`}function g(e){let t=e?.trim();if(t)return`https://bunq.me/${t.replace(/^(?:https?:\/\/)?bunq\.me\//i,``).replace(/\/$/,``)}`}function _(e,t){return e.enabled!==t.enabled||e.beerPrice!==t.beerPrice||g(e.bunqMeLink)!==g(t.bunqMeLink)}var v,y,b;function x(){return(x=e((()=>{v=1e4,y=/^\d+(?:[.,]\d{1,2})?$/,b=/^(?:https?:\/\/)?bunq\.me\/[A-Za-z0-9_-]+\/?$/i})))()}function S({settings:e,isLoading:t,isError:n,isSaving:r,error:i,onSave:a}){return(0,T.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Money pool`}),(0,T.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Show your team's shared pool, and what its balance buys in beers.`})]}),t&&(0,T.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),n&&(0,T.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load the money pool settings. Please try again.`}),e&&!t&&!n&&(0,T.jsx)(C,{settings:e,isSaving:r,error:i,onSave:a})]})}function C({settings:e,isSaving:t,error:n,onSave:r}){let[i,a]=(0,w.useState)(e.enabled),[s,l]=(0,w.useState)(m(e.beerPrice)),[d,g]=(0,w.useState)(e.bunqMeLink??``),v=p(s),y=Number.isNaN(v)?`Enter a price between €0,01 and €100,00.`:null,b=h(d),x={enabled:i,beerPrice:v,bunqMeLink:d.trim()||void 0},S=!y&&!b&&_(e,x);return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,T.jsx)(`span`,{className:`text-small font-medium`,children:`Show the money pool to the team`}),(0,T.jsx)(f,{checked:i,onCheckedChange:a,"aria-label":`Show the money pool to the team`})]}),(0,T.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,T.jsx)(u,{htmlFor:`money-pool-beer-price`,children:`Beer price (€)`}),(0,T.jsx)(c,{id:`money-pool-beer-price`,inputMode:`decimal`,value:s,placeholder:`2,70`,onChange:e=>l(e.target.value),className:`w-48`}),(0,T.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`Leave empty to hide the Beer Counter.`}),y&&(0,T.jsx)(`p`,{className:`text-small text-red`,children:y})]}),(0,T.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,T.jsx)(u,{htmlFor:`money-pool-bunq-me-link`,children:`bunq.me link`}),(0,T.jsx)(c,{id:`money-pool-bunq-me-link`,inputMode:`url`,value:d,placeholder:`https://bunq.me/yourteam`,onChange:e=>g(e.target.value)}),b&&(0,T.jsx)(`p`,{className:`text-small text-red`,children:b})]}),n&&(0,T.jsx)(`p`,{className:`text-small text-red`,children:n}),(0,T.jsx)(`div`,{children:(0,T.jsx)(o,{disabled:t||!S,onClick:()=>r(x),children:t?`Saving…`:`Save money pool`})})]})}var w,T;function E(){return(E=e((()=>{w=t(),a(),s(),l(),d(),x(),T=n(),S.__docgenInfo={description:`Presentational money pool settings — the complete section, heading and all: the on/off switch, the
Beer Counter price and the team's bunq.me link. Owns only local draft state; the query and
mutation live in the MoneySettings container. Loading and error shells are props-driven so every
state renders as a story without a network (ADR-0017).`,methods:[],displayName:`MoneySettingsView`,props:{settings:{required:!1,tsType:{name:`MoneyPoolSettings`},description:`The saved settings (the baseline the draft is compared against).`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The settings query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The settings query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(settings: MoneyPoolSettings) => void`,signature:{arguments:[{type:{name:`MoneyPoolSettings`},name:`settings`}],return:{name:`void`}}},description:``}}}})))()}var D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{r(),E(),D=n(),{expect:O,fn:k,waitFor:A,within:j}=__STORYBOOK_MODULE_TEST__,M={title:`features/money-settings/MoneySettingsView`,component:S,args:{settings:{enabled:!0,beerPrice:270,bunqMeLink:`https://bunq.me/setpointvt`},onSave:k()}},N={play:async({canvas:e})=>{await O(e.getByRole(`switch`,{name:`Show the money pool to the team`})).toBeChecked(),await O(e.getByLabelText(`Beer price (€)`)).toHaveValue(`2,70`),await O(e.getByLabelText(`bunq.me link`)).toHaveValue(`https://bunq.me/setpointvt`),await O(e.getByRole(`button`,{name:`Save money pool`})).toBeDisabled()}},P={render:e=>(0,D.jsx)(i,{items:{Loading:(0,D.jsx)(S,{...e,settings:void 0,isLoading:!0}),Error:(0,D.jsx)(S,{...e,settings:void 0,isError:!0}),"Off without price":(0,D.jsx)(S,{...e,settings:{enabled:!1,beerPrice:void 0,bunqMeLink:void 0}})}}),play:async({canvas:e})=>{let t=t=>j(e.getByRole(`region`,{name:t}));await O(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await O(t(`Loading`).queryByRole(`button`,{name:`Save money pool`})).not.toBeInTheDocument(),await O(t(`Error`).getByText(`Couldn't load the money pool settings. Please try again.`)).toBeInTheDocument(),await O(t(`Error`).queryByRole(`button`,{name:`Save money pool`})).not.toBeInTheDocument(),await O(t(`Off without price`).getByRole(`switch`)).not.toBeChecked(),await O(t(`Off without price`).getByLabelText(`Beer price (€)`)).toHaveValue(``),await O(t(`Off without price`).getByRole(`button`,{name:`Save money pool`})).toBeDisabled()}},F={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=e.getByLabelText(`Beer price (€)`),i=e.getByLabelText(`bunq.me link`),a=e.getByRole(`button`,{name:`Save money pool`});await t.clear(r),await t.type(r,`0`),await A(()=>O(e.getByText(`Enter a price between €0,01 and €100,00.`)).toBeInTheDocument()),await O(a).toBeDisabled(),await t.clear(r),await t.type(r,`3,10`),await t.clear(i),await t.type(i,`https://evil.example/x`),await A(()=>O(e.getByText(`Use a link like https://bunq.me/yourteam.`)).toBeInTheDocument()),await O(a).toBeDisabled(),await t.clear(i),await t.type(i,`bunq.me/newteam`),await t.click(e.getByRole(`switch`,{name:`Show the money pool to the team`})),await O(a).toBeEnabled(),await t.click(a),await O(n.onSave).toHaveBeenCalledWith({enabled:!1,beerPrice:310,bunqMeLink:`bunq.me/newteam`})}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('switch', {
      name: 'Show the money pool to the team'
    })).toBeChecked();
    await expect(canvas.getByLabelText('Beer price (€)')).toHaveValue('2,70');
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/setpointvt');
    await expect(canvas.getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MoneySettingsView {...args} settings={undefined} isLoading />,
    Error: <MoneySettingsView {...args} settings={undefined} isError />,
    'Off without price': <MoneySettingsView {...args} settings={{
      enabled: false,
      beerPrice: undefined,
      bunqMeLink: undefined
    }} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Save money pool'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load the money pool settings. Please try again.")).toBeInTheDocument();
    await expect(region('Error').queryByRole('button', {
      name: 'Save money pool'
    })).not.toBeInTheDocument();
    await expect(region('Off without price').getByRole('switch')).not.toBeChecked();
    await expect(region('Off without price').getByLabelText('Beer price (€)')).toHaveValue('');
    await expect(region('Off without price').getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
    const price = canvas.getByLabelText('Beer price (€)');
    const link = canvas.getByLabelText('bunq.me link');
    const save = canvas.getByRole('button', {
      name: 'Save money pool'
    });
    await userEvent.clear(price);
    await userEvent.type(price, '0');
    await waitFor(() => expect(canvas.getByText('Enter a price between €0,01 and €100,00.')).toBeInTheDocument());
    await expect(save).toBeDisabled();
    await userEvent.clear(price);
    await userEvent.type(price, '3,10');
    await userEvent.clear(link);
    await userEvent.type(link, 'https://evil.example/x');
    await waitFor(() => expect(canvas.getByText('Use a link like https://bunq.me/yourteam.')).toBeInTheDocument());
    await expect(save).toBeDisabled();
    await userEvent.clear(link);
    await userEvent.type(link, 'bunq.me/newteam');
    await userEvent.click(canvas.getByRole('switch', {
      name: 'Show the money pool to the team'
    }));
    await expect(save).toBeEnabled();
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalledWith({
      enabled: false,
      beerPrice: 310,
      bunqMeLink: 'bunq.me/newteam'
    });
  }
}`,...F.parameters?.docs?.source}}},I=[`Data`,`Shells`,`Interactions`]})))()}L();export{N as Data,F as Interactions,P as Shells,I as __namedExportsOrder,M as default};