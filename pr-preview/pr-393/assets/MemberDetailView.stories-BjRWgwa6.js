import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./link-D-d0gUtE.js";import{a as o,n as s}from"./team-routes-CY4s9zaE.js";import{n as c,t as l}from"./createLucideIcon-CC9AVT2s.js";import{n as u,t as d}from"./arrow-left-BMsyx5hx.js";import{n as f,t as p}from"./button-8uXmWXOg.js";import{n as m,r as h}from"./app-shell-decorator-DJQAPOu4.js";import{n as g,t as _}from"./EditProfileForm-Ct-UbhwC.js";import{n as v,t as y}from"./MemberFace-xizFg9Km.js";var b,x;function S(){return(S=e((()=>{c(),b=[[`line`,{x1:`4`,x2:`20`,y1:`9`,y2:`9`,key:`4lhtct`}],[`line`,{x1:`4`,x2:`20`,y1:`15`,y2:`15`,key:`vyu0kd`}],[`line`,{x1:`10`,x2:`8`,y1:`3`,y2:`21`,key:`1ggp8o`}],[`line`,{x1:`16`,x2:`14`,y1:`3`,y2:`21`,key:`weycgp`}]],x=l(`hash`,b)})))()}var C,w;function T(){return(T=e((()=>{c(),C=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}]],w=l(`shield`,C)})))()}var E,D;function O(){return(O=e((()=>{c(),E=[[`path`,{d:`M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z`,key:`1wgbhj`}]],D=l(`shirt`,E)})))()}function k({member:e,positions:t,isLoading:n,isError:r,canEdit:i,isEditing:s,isSaving:c,errorCode:l,errorMessage:u,onEdit:f,onCancelEdit:m,onSubmit:h}){let g=o();return(0,A.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,A.jsxs)(a,{to:g.team,className:`flex items-center gap-1 self-start text-small font-medium text-muted-foreground`,children:[(0,A.jsx)(d,{size:16,"aria-hidden":`true`}),` Team`]}),n&&(0,A.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),r&&(0,A.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load this member. Please try again.`}),!n&&!r&&!e&&(0,A.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This person is not on the team.`}),e&&(0,A.jsxs)(A.Fragment,{children:[(0,A.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,A.jsx)(y,{userId:e.userId,name:e.displayName,shirtNumber:e.shirtNumber,size:`lg`}),(0,A.jsx)(`h2`,{className:`font-display text-title font-bold`,children:e.displayName}),(0,A.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),s?(0,A.jsxs)(`div`,{className:`${j} p-4`,children:[u&&(0,A.jsx)(`p`,{role:`alert`,className:`mb-4 rounded-md bg-red/10 px-3 py-2 text-small text-red`,children:u}),(0,A.jsx)(_,{currentName:e.displayName,positions:t,currentPositionId:e.position?.id??null,withShirtNumber:!0,currentShirtNumber:e.shirtNumber??null,isSaving:c,errorCode:l,onSubmit:h,onCancel:m})]}):(0,A.jsxs)(A.Fragment,{children:[(0,A.jsxs)(`div`,{className:`${j} divide-y divide-border`,children:[(0,A.jsxs)(`div`,{className:M,children:[(0,A.jsx)(x,{size:18,className:N,"aria-hidden":`true`}),(0,A.jsx)(`span`,{className:`font-medium`,children:`Shirt number`}),(0,A.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.shirtNumber??`None`})]}),(0,A.jsxs)(`div`,{className:M,children:[(0,A.jsx)(D,{size:18,className:N,"aria-hidden":`true`}),(0,A.jsx)(`span`,{className:`font-medium`,children:`Position`}),(0,A.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,A.jsxs)(`div`,{className:M,children:[(0,A.jsx)(w,{size:18,className:N,"aria-hidden":`true`}),(0,A.jsx)(`span`,{className:`font-medium`,children:`Role`}),(0,A.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.role===`ADMIN`?`Admin`:`Member`})]})]}),i&&(0,A.jsx)(p,{variant:`outline`,onClick:f,children:`Edit profile`})]})]})]})}var A,j,M,N;function P(){return(P=e((()=>{i(),u(),S(),T(),O(),v(),g(),s(),f(),A=t(),j=`overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]`,M=`flex items-center gap-3 px-4 py-3 text-small`,N=`shrink-0 text-muted-foreground`,k.__docgenInfo={description:`One Member's page, opened from the /team roster (ADR-0038): their face with the Shirt Number, then
number, Position and Role as a settings list. The member and Admins get an Edit button that swaps
the list for the profile form. Prop-only; the route container owns the queries, the mutation and
the editing flag, so every state is a story.`,methods:[],displayName:`MemberDetailView`,props:{member:{required:!1,tsType:{name:`Member`},description:`Undefined while loading, on error, or when the id names nobody on the Roster.`},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},canEdit:{required:!0,tsType:{name:`boolean`},description:`The member themselves, or an Admin (ADR-0038). Role changes stay in team settings.`},isEditing:{required:!0,tsType:{name:`boolean`},description:``},isSaving:{required:!0,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update (e.g. NAME_TAKEN, NUMBER_TAKEN), shown inline.`},errorMessage:{required:!1,tsType:{name:`string`},description:`A failed save the form has no field for (e.g. forbidden, member gone), shown above the form.`},onEdit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCancelEdit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null, shirtNumber: number | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`},{type:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},name:`shirtNumber`}],return:{name:`void`}}},description:``}}}})))()}var F,I,L,R,z,B,V,H,U,W,G,K,q;function J(){return(J=e((()=>{n(),h(),P(),F=t(),{expect:I,fn:L,userEvent:R,within:z}=__STORYBOOK_MODULE_TEST__,B=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],V={userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:B[0],onboarded:!0,shirtNumber:12},H=m(`team`),U={title:`pages/member/MemberDetailView`,component:k,decorators:H.decorators,parameters:H.parameters,args:{member:V,positions:B,canEdit:!0,isEditing:!1,isSaving:!1,onEdit:L(),onCancelEdit:L(),onSubmit:L()}},W={play:async({canvas:e})=>{await I(e.getByRole(`heading`,{name:`Ada Lovelace`})).toBeInTheDocument(),await I(e.getByLabelText(`Shirt number 12`)).toBeInTheDocument(),await I(e.getByText(`Admin`)).toBeInTheDocument(),await I(e.getAllByRole(`link`,{name:`Team`})).toHaveLength(2),await I(e.getByRole(`button`,{name:`Edit profile`})).toBeInTheDocument()}},G={render:e=>(0,F.jsx)(r,{items:{"Read only":(0,F.jsx)(k,{...e,canEdit:!1,member:{...V,userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,shirtNumber:null}}),Editing:(0,F.jsx)(k,{...e,isEditing:!0,errorCode:`NUMBER_TAKEN`}),"Save failed":(0,F.jsx)(k,{...e,isEditing:!0,errorCode:`NOT_FOUND`,errorMessage:`Member not found.`}),Loading:(0,F.jsx)(k,{...e,member:void 0,isLoading:!0}),Error:(0,F.jsx)(k,{...e,member:void 0,isError:!0}),"Not on the team":(0,F.jsx)(k,{...e,member:void 0})}}),play:async({canvas:e})=>{let t=t=>z(e.getByRole(`region`,{name:t}));await I(t(`Read only`).queryByRole(`button`,{name:`Edit profile`})).not.toBeInTheDocument(),await I(t(`Read only`).getByText(`None`)).toBeInTheDocument(),await I(t(`Read only`).getAllByText(`Unassigned`).length).toBeGreaterThan(0),await I(t(`Read only`).queryByLabelText(/^Shirt number/)).not.toBeInTheDocument(),await I(t(`Editing`).getByLabelText(`Shirt number`)).toHaveValue(`12`),await I(t(`Editing`).getByText(`That shirt number is already taken.`)).toBeInTheDocument(),await I(t(`Save failed`).getByRole(`alert`)).toHaveTextContent(`Member not found.`),await I(t(`Editing`).queryByRole(`alert`)).not.toBeInTheDocument(),await I(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await I(t(`Error`).getByText(/couldn't load this member/i)).toBeInTheDocument(),await I(t(`Not on the team`).getByText(`This person is not on the team.`)).toBeInTheDocument()}},K={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,F.jsx)(r,{items:{Reading:(0,F.jsx)(k,{...e}),Editing:(0,F.jsx)(k,{...e,isEditing:!0})}}),play:async({canvas:e,args:t})=>{let n=t=>z(e.getByRole(`region`,{name:t}));await R.click(n(`Reading`).getByRole(`button`,{name:`Edit profile`})),await I(t.onEdit).toHaveBeenCalledOnce();let r=n(`Editing`),i=r.getByLabelText(`Shirt number`);await R.clear(i),await R.type(i,`1000`),await I(r.getByText(`Use a whole number from 0 to 999.`)).toBeInTheDocument(),await I(r.getByRole(`button`,{name:`Save`})).toBeDisabled(),await R.clear(i),await R.type(i,`07`),await R.click(r.getByRole(`button`,{name:`Save`})),await I(t.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p1`,7),await R.clear(i),await R.click(r.getByRole(`button`,{name:`Save`})),await I(t.onSubmit).toHaveBeenLastCalledWith(`Ada Lovelace`,`p1`,null),await R.click(r.getByRole(`button`,{name:`Cancel`})),await I(t.onCancelEdit).toHaveBeenCalledOnce()}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('heading', {
      name: 'Ada Lovelace'
    })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Shirt number 12')).toBeInTheDocument();
    await expect(canvas.getByText('Admin')).toBeInTheDocument();
    // Back to the roster, beside the shell's own Team tab.
    await expect(canvas.getAllByRole('link', {
      name: 'Team'
    })).toHaveLength(2);
    await expect(canvas.getByRole('button', {
      name: 'Edit profile'
    })).toBeInTheDocument();
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Somebody else's page, seen by a plain member: details only, no Edit.
    'Read only': <MemberDetailView {...args} canEdit={false}
    // shirtNumber null, as the API sends "no number" (the generated type says undefined).
    member={{
      ...ADA,
      userId: 'u3',
      displayName: 'Alan Turing',
      role: 'USER',
      position: undefined,
      shirtNumber: null as unknown as undefined
    }} />,
    Editing: <MemberDetailView {...args} isEditing errorCode="NUMBER_TAKEN" />,
    // A failure the form has no field for, e.g. the member was removed meanwhile.
    'Save failed': <MemberDetailView {...args} isEditing errorCode="NOT_FOUND" errorMessage="Member not found." />,
    Loading: <MemberDetailView {...args} member={undefined} isLoading />,
    Error: <MemberDetailView {...args} member={undefined} isError />,
    'Not on the team': <MemberDetailView {...args} member={undefined} />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Read only').queryByRole('button', {
      name: 'Edit profile'
    })).not.toBeInTheDocument();
    await expect(region('Read only').getByText('None')).toBeInTheDocument();
    await expect(region('Read only').getAllByText('Unassigned').length).toBeGreaterThan(0);
    await expect(region('Read only').queryByLabelText(/^Shirt number/)).not.toBeInTheDocument();
    await expect(region('Editing').getByLabelText('Shirt number')).toHaveValue('12');
    await expect(region('Editing').getByText('That shirt number is already taken.')).toBeInTheDocument();
    await expect(region('Save failed').getByRole('alert')).toHaveTextContent('Member not found.');
    await expect(region('Editing').queryByRole('alert')).not.toBeInTheDocument();
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText(/couldn't load this member/i)).toBeInTheDocument();
    await expect(region('Not on the team').getByText('This person is not on the team.')).toBeInTheDocument();
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Reading: <MemberDetailView {...args} />,
    Editing: <MemberDetailView {...args} isEditing />
  }} />,
  play: async ({
    canvas,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await userEvent.click(region('Reading').getByRole('button', {
      name: 'Edit profile'
    }));
    await expect(args.onEdit).toHaveBeenCalledOnce();
    const editing = region('Editing');
    const number = editing.getByLabelText('Shirt number');
    await userEvent.clear(number);
    await userEvent.type(number, '1000');
    await expect(editing.getByText('Use a whole number from 0 to 999.')).toBeInTheDocument();
    await expect(editing.getByRole('button', {
      name: 'Save'
    })).toBeDisabled();
    await userEvent.clear(number);
    await userEvent.type(number, '07');
    await userEvent.click(editing.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Ada Lovelace', 'p1', 7);

    // Emptying the field clears the number.
    await userEvent.clear(number);
    await userEvent.click(editing.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Ada Lovelace', 'p1', null);
    await userEvent.click(editing.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onCancelEdit).toHaveBeenCalledOnce();
  }
}`,...K.parameters?.docs?.source}}},q=[`Data`,`Shells`,`Interactions`]})))()}J();export{W as Data,K as Interactions,G as Shells,q as __namedExportsOrder,U as default};