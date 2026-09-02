import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-BD-ZbcV5.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./button-DBgqMzdC.js";import{n as a,t as o}from"./input-BuYIGuSa.js";import{n as s,t as c}from"./label-9bot1zRv.js";import{n as l,t as u}from"./teams-CivOJ-q5.js";function d({isPending:e,error:t,createdName:n,onSubmit:r}){let[a,s]=(0,f.useState)(``),[l,u]=(0,f.useState)(``),d=l.length>0&&!m.test(l)?`Use lowercase letters, numbers, and hyphens.`:null,h=a.trim().length>0&&l.length>0&&d===null&&!e,g=e=>{e.preventDefault(),h&&r({name:a.trim(),slug:l})},_=(...e)=>t&&e.includes(t.code)?t.message:null,v=_(`INVALID_NAME`),y=_(`INVALID_SLUG`,`SLUG_TAKEN`)??d,b=_(`GENERIC`,`INVALID_CREATION_CODE`);return(0,p.jsxs)(`form`,{onSubmit:g,className:`flex flex-col gap-3`,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(`h2`,{className:`font-display text-2xl font-bold`,children:`Create a team`}),(0,p.jsx)(`p`,{className:`mt-1 text-sm text-muted-foreground`,children:`Creates an empty team you can enter and set up, then hand over with an admin invite link. You don't join it.`})]}),b&&(0,p.jsx)(`p`,{role:`alert`,className:`text-sm text-destructive`,children:b}),n&&!b&&(0,p.jsxs)(`p`,{role:`status`,className:`text-sm text-green`,children:[`Created “`,n,`”. Enter it from the list below to set it up.`]}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(c,{htmlFor:`ml-team-name`,children:`Team name`}),(0,p.jsx)(o,{id:`ml-team-name`,value:a,disabled:e,onChange:e=>s(e.target.value),placeholder:`e.g. Tovo Dames 5`}),v&&(0,p.jsx)(`p`,{className:`mt-1 text-sm text-destructive`,children:v})]}),(0,p.jsxs)(`div`,{children:[(0,p.jsx)(c,{htmlFor:`ml-team-slug`,children:`Team address`}),(0,p.jsx)(o,{id:`ml-team-slug`,value:l,disabled:e,onChange:e=>u(e.target.value),placeholder:`tovo-dames-5`}),y&&(0,p.jsx)(`p`,{className:`mt-1 text-sm text-destructive`,children:y})]}),(0,p.jsx)(i,{type:`submit`,disabled:!h,className:`self-start`,children:e?`Creating…`:`Create team`})]})}var f,p,m;function h(){return(h=e((()=>{f=t(),r(),a(),s(),p=n(),m=/^[a-z0-9]+(-[a-z0-9]+)*$/,d.__docgenInfo={description:`Presentational memberless-create form for the platform console (ADR-0024 §5). Prop-only
(isPending / error / createdName / onSubmit) so every state renders from props with no network; the
mutation and the team-list refresh live in the container. No creation code field — the platform-admin
allowlist on \`/admin\` is the gate — and no member is created, so there is no founder to name.`,methods:[],displayName:`CreateMemberlessTeamView`,props:{isPending:{required:!0,tsType:{name:`boolean`},description:``},error:{required:!1,tsType:{name:`union`,raw:`CreateTeamError | null`,elements:[{name:`CreateTeamError`},{name:`null`}]},description:`The typed failure from the last submit, placed by its code (field vs banner); null while clean.`},createdName:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Set after a successful create, so the console confirms the (empty) team is ready to enter.`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(values: { name: string; slug: string }) => void`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{ name: string; slug: string }`,signature:{properties:[{key:`name`,value:{name:`string`,required:!0}},{key:`slug`,value:{name:`string`,required:!0}}]}},name:`values`}],return:{name:`void`}}},description:``}}}})))()}var g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{l(),h(),{expect:g,fn:_}=__STORYBOOK_MODULE_TEST__,v={title:`features/create-memberless-team/CreateMemberlessTeamView`,component:d,args:{isPending:!1,onSubmit:_()}},y={play:async({canvas:e})=>{await g(e.getByLabelText(`Team name`)).toBeInTheDocument(),await g(e.getByLabelText(`Team address`)).toBeInTheDocument(),await g(e.queryByLabelText(`Creation code`)).not.toBeInTheDocument(),await g(e.getByRole(`button`,{name:`Create team`})).toBeDisabled()}},b={args:{isPending:!0},play:async({canvas:e})=>{await g(e.getByRole(`button`,{name:`Creating…`})).toBeDisabled()}},x={args:{error:new u(`SLUG_TAKEN`,`That address is already taken — try another.`)},play:async({canvas:e})=>{await g(e.getByText(`That address is already taken — try another.`)).toBeInTheDocument()}},S={args:{error:new u(`GENERIC`,`Something went wrong creating the team. Please try again.`)},play:async({canvas:e})=>{await g(e.getByRole(`alert`)).toHaveTextContent(`Something went wrong creating the team.`)}},C={args:{createdName:`Tovo Dames 5`},play:async({canvas:e})=>{await g(e.getByRole(`status`)).toHaveTextContent(`Created “Tovo Dames 5”.`)}},w={play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Dames 5`),await t.type(e.getByLabelText(`Team address`),`tovo-dames-5`),await t.click(e.getByRole(`button`,{name:`Create team`})),await g(n.onSubmit).toHaveBeenCalledWith({name:`Tovo Dames 5`,slug:`tovo-dames-5`})}},T={play:async({canvas:e,userEvent:t,args:n})=>{await t.type(e.getByLabelText(`Team name`),`Tovo Dames 5`),await t.type(e.getByLabelText(`Team address`),`Bad Slug`),await g(e.getByText(`Use lowercase letters, numbers, and hyphens.`)).toBeInTheDocument(),await g(e.getByRole(`button`,{name:`Create team`})).toBeDisabled(),await g(n.onSubmit).not.toHaveBeenCalled()}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Creating…'
    })).toBeDisabled();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    error: new CreateTeamError('SLUG_TAKEN', 'That address is already taken — try another.')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('That address is already taken — try another.')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    error: new CreateTeamError('GENERIC', 'Something went wrong creating the team. Please try again.')
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Something went wrong creating the team.');
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    createdName: 'Tovo Dames 5'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Created “Tovo Dames 5”.');
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.type(canvas.getByLabelText('Team name'), 'Tovo Dames 5');
    await userEvent.type(canvas.getByLabelText('Team address'), 'tovo-dames-5');
    await userEvent.click(canvas.getByRole('button', {
      name: 'Create team'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: 'Tovo Dames 5',
      slug: 'tovo-dames-5'
    });
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
  }
}`,...T.parameters?.docs?.source}}},E=[`Default`,`Pending`,`SlugTaken`,`GenericError`,`Created`,`SubmitsValidInput`,`RejectsBadSlug`]})))()}D();export{C as Created,y as Default,S as GenericError,b as Pending,T as RejectsBadSlug,x as SlugTaken,w as SubmitsValidInput,E as __namedExportsOrder,v as default};