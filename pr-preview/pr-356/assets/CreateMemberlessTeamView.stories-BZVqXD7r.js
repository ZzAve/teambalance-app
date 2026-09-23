import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BiajjKFy.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{n as a,t as o}from"./button-BkXpgCJ0.js";import{n as s,t as c}from"./input-Bk94cEHf.js";import{n as l,t as u}from"./label-CoKbLJgp.js";import{n as d,t as f}from"./teams-CoOwVAF9.js";function p({isPending:e,error:t,createdName:n,onSubmit:r}){let[i,a]=(0,m.useState)(``),[s,l]=(0,m.useState)(``),d=s.length>0&&!g.test(s)?`Use lowercase letters, numbers, and hyphens.`:null,f=i.trim().length>0&&s.length>0&&d===null&&!e,p=e=>{e.preventDefault(),f&&r({name:i.trim(),slug:s})},_=(...e)=>t&&e.includes(t.code)?t.message:null,v=_(`INVALID_NAME`),y=_(`INVALID_SLUG`,`SLUG_TAKEN`)??d,b=_(`GENERIC`,`INVALID_CREATION_CODE`);return(0,h.jsxs)(`form`,{onSubmit:p,className:`flex flex-col gap-3`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Create a team`}),(0,h.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Creates an empty team you can enter and set up, then hand over with an admin invite link. You don't join it.`})]}),b&&(0,h.jsx)(`p`,{role:`alert`,className:`text-small text-destructive`,children:b}),n&&!b&&(0,h.jsxs)(`p`,{role:`status`,className:`text-small text-green`,children:[`Created “`,n,`”. Enter it from the list below to set it up.`]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(u,{htmlFor:`ml-team-name`,children:`Team name`}),(0,h.jsx)(c,{id:`ml-team-name`,value:i,disabled:e,onChange:e=>a(e.target.value),placeholder:`e.g. Tovo Dames 5`}),v&&(0,h.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:v})]}),(0,h.jsxs)(`div`,{children:[(0,h.jsx)(u,{htmlFor:`ml-team-slug`,children:`Team address`}),(0,h.jsx)(c,{id:`ml-team-slug`,value:s,disabled:e,onChange:e=>l(e.target.value),placeholder:`tovo-dames-5`}),y&&(0,h.jsx)(`p`,{className:`mt-1 text-small text-destructive`,children:y})]}),(0,h.jsx)(o,{type:`submit`,disabled:!f,className:`self-start`,children:e?`Creating…`:`Create team`})]})}var m,h,g;function _(){return(_=e((()=>{m=t(),a(),s(),l(),h=n(),g=/^[a-z0-9]+(-[a-z0-9]+)*$/,p.__docgenInfo={description:`Presentational memberless-create form for the platform console (ADR-0024 §5). Prop-only
(isPending / error / createdName / onSubmit) so every state renders from props with no network; the
mutation and the team-list refresh live in the container. No creation code field — the platform-admin
allowlist on \`/admin\` is the gate — and no member is created, so there is no founder to name.`,methods:[],displayName:`CreateMemberlessTeamView`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},createdName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Set after a successful create, so the console confirms the (empty) team is ready to enter.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``}}}})))()}var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{d(),r(),_(),v=n(),{expect:y,fn:b,within:x}=__STORYBOOK_MODULE_TEST__,S={title:`features/create-memberless-team/CreateMemberlessTeamView`,component:p,args:{isPending:!1,onSubmit:b()}},C={play:async({canvas:e})=>{await y(e.getByLabelText(`Team name`)).toBeInTheDocument(),await y(e.getByLabelText(`Team address`)).toBeInTheDocument(),await y(e.queryByLabelText(`Creation code`)).not.toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},w={render:e=>(0,v.jsx)(i,{items:{Pending:(0,v.jsx)(p,{...e,isPending:!0}),"Slug taken":(0,v.jsx)(p,{...e,error:new f(`SLUG_TAKEN`,`That address is already taken — try another.`)}),"Generic error":(0,v.jsx)(p,{...e,error:new f(`GENERIC`,`Something went wrong creating the team. Please try again.`)}),Created:(0,v.jsx)(p,{...e,createdName:`Tovo Dames 5`})}}),play:async({canvas:e})=>{let t=t=>x(e.getByRole(`region`,{name:t}));await y(t(`Pending`).getByRole(`button`,{name:`Creating…`})).toBeDisabled(),await y(t(`Slug taken`).getByText(`That address is already taken — try another.`)).toBeInTheDocument(),await y(t(`Generic error`).getByRole(`alert`)).toHaveTextContent(`Something went wrong creating the team.`),await y(t(`Created`).getByRole(`status`)).toHaveTextContent(`Created “Tovo Dames 5”.`)}},T={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Dames 5`),await t.type(e.getByLabelText(`Team address`),`Bad Slug`),await y(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await y(e.getByRole(`button`,{name:`Create team`})).toBeDisabled(),await y(n.onSubmit).not.toHaveBeenCalled(),await t.clear(e.getByLabelText(`Team address`)),await t.type(e.getByLabelText(`Team address`),`tovo-dames-5`),await t.click(e.getByRole(`button`,{name:`Create team`})),await y(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Dames 5`,slug:`tovo-dames-5`})}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Team name')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Team address')).toBeInTheDocument();
    // No creation code — the /admin allowlist is the gate.
    await expect(canvas.queryByLabelText('Creation code')).not.toBeInTheDocument();
    // Submit is disabled until name + a valid slug are present.
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Pending: <CreateMemberlessTeamView {...args} isPending />,
    'Slug taken': <CreateMemberlessTeamView {...args} error={new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')} />,
    'Generic error': <CreateMemberlessTeamView {...args} error={new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.')} />,
    Created: <CreateMemberlessTeamView {...args} createdName="Tovo Dames 5" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Pending').getByRole('button', {
      name: 'Creating…'
    })).toBeDisabled();
    await expect(region('Slug taken').getByText('That address is already taken — try another.')).toBeInTheDocument();
    await expect(region('Generic error').getByRole('alert')).toHaveTextContent('Something went wrong creating the team.');
    await expect(region('Created').getByRole('status')).toHaveTextContent('Created “Tovo Dames 5”.');
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5');
    await userEvent.type(canvas.getByLabelText('Team address'), 'Bad Slug');
    await expect(canvas.getByText('Use lowercase letters, numbers, and hyphens.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Create team'
    })).toBeDisabled();
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.clear(canvas.getByLabelText('Team address'));
    await userEvent.type(canvas.getByLabelText('Team address'), 'tovo-dames-5');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create team'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'Tovo Dames 5',
      slug: 'tovo-dames-5'
    });
  }
}`,...T.parameters?.docs?.source}}},E=[`Data`,`Shells`,`Interactions`]})))()}D();export{C as Data,T as Interactions,w as Shells,E as __namedExportsOrder,S as default};