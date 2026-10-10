import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-D-gPkH2q.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./link-D4PNaBTM.js";import{a as s,n as c}from"./team-routes-OkJtVONy.js";import{n as l,t as u}from"./createLucideIcon-BKRRTB5R.js";import{n as d,t as f}from"./arrow-left-v9xo0aAT.js";import{n as p,t as m}from"./button-HJX3GoHV.js";import{n as h,r as g}from"./app-shell-decorator-DSWziJMv.js";import{n as _,t as v}from"./EditProfileForm-Dl4EcZnY.js";import{n as y,t as ee}from"./PhotoPicker-CCbTfb2Q.js";import{n as b,t as te}from"./ConfirmDialog-osK1a7Wm.js";import{n as x,t as S}from"./MemberFace-Bi4TneDA.js";var C,w;function T(){return(T=e((()=>{l(),C=[[`line`,{x1:`4`,x2:`20`,y1:`9`,y2:`9`,key:`4lhtct`}],[`line`,{x1:`4`,x2:`20`,y1:`15`,y2:`15`,key:`vyu0kd`}],[`line`,{x1:`10`,x2:`8`,y1:`3`,y2:`21`,key:`1ggp8o`}],[`line`,{x1:`16`,x2:`14`,y1:`3`,y2:`21`,key:`weycgp`}]],w=u(`hash`,C)})))()}var E,D;function O(){return(O=e((()=>{l(),E=[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}]],D=u(`shield`,E)})))()}var k,A;function j(){return(j=e((()=>{l(),k=[[`path`,{d:`M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z`,key:`1wgbhj`}]],A=u(`shirt`,k)})))()}function M({member:e,positions:t,isLoading:n,isError:r,canEdit:i,isEditing:a,isSaving:c,errorCode:l,errorMessage:u,onEdit:d,onCancelEdit:p,onSubmit:h,canChangePhoto:g,canRemovePhoto:_,hasPersonalPhoto:y,isPhotoSaving:b,photoErrorMessage:x,onUploadPhoto:C,onUsePersonalPhoto:T,onRemovePhoto:E}){let O=s(),[k,j]=(0,N.useState)(!1);return(0,P.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,P.jsxs)(o,{to:O.team,className:`flex items-center gap-1 self-start text-small font-medium text-muted-foreground`,children:[(0,P.jsx)(f,{size:16,"aria-hidden":`true`}),` Team`]}),n&&(0,P.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),r&&(0,P.jsx)(`p`,{className:`text-small text-red`,children:`Couldn't load this member. Please try again.`}),!n&&!r&&!e&&(0,P.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This person is not on the team.`}),e&&(0,P.jsxs)(P.Fragment,{children:[(0,P.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,P.jsx)(S,{userId:e.userId,name:e.displayName,shirtNumber:e.shirtNumber,photoVersion:e.photoVersion,size:`lg`}),(0,P.jsx)(`h2`,{className:`font-display text-title font-bold`,children:e.displayName}),(0,P.jsx)(`span`,{className:`text-small text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(g||_&&e.photoVersion)&&(0,P.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,P.jsxs)(`div`,{className:`flex flex-wrap justify-center gap-2`,children:[g&&y&&(0,P.jsx)(m,{variant:`outline`,size:`sm`,disabled:b,onClick:T,children:`Use my personal photo`}),g&&(0,P.jsx)(ee,{label:e.photoVersion?`Upload a different photo`:`Upload photo`,disabled:b,onPicked:C}),_&&e.photoVersion&&(0,P.jsx)(m,{variant:`outline`,size:`sm`,disabled:b,onClick:()=>j(!0),children:`Remove photo`})]}),x&&(0,P.jsx)(`p`,{className:`text-small text-red`,children:x}),(0,P.jsx)(te,{open:k,title:`Remove photo`,description:g?`The team will see your initials until you add a new photo.`:`Remove ${e.displayName}'s photo? Only they can add a new one.`,confirmLabel:`Remove`,onConfirm:()=>{j(!1),E()},onCancel:()=>j(!1)})]}),a?(0,P.jsxs)(`div`,{className:`${F} p-4`,children:[u&&(0,P.jsx)(`p`,{role:`alert`,className:`mb-4 rounded-md bg-red/10 px-3 py-2 text-small text-red`,children:u}),(0,P.jsx)(v,{currentName:e.displayName,positions:t,currentPositionId:e.position?.id??null,withShirtNumber:!0,currentShirtNumber:e.shirtNumber??null,isSaving:c,errorCode:l,onSubmit:h,onCancel:p})]}):(0,P.jsxs)(P.Fragment,{children:[(0,P.jsxs)(`div`,{className:`${F} divide-y divide-border`,children:[(0,P.jsxs)(`div`,{className:I,children:[(0,P.jsx)(w,{size:18,className:L,"aria-hidden":`true`}),(0,P.jsx)(`span`,{className:`font-medium`,children:`Shirt number`}),(0,P.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.shirtNumber??`None`})]}),(0,P.jsxs)(`div`,{className:I,children:[(0,P.jsx)(A,{size:18,className:L,"aria-hidden":`true`}),(0,P.jsx)(`span`,{className:`font-medium`,children:`Position`}),(0,P.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,P.jsxs)(`div`,{className:I,children:[(0,P.jsx)(D,{size:18,className:L,"aria-hidden":`true`}),(0,P.jsx)(`span`,{className:`font-medium`,children:`Role`}),(0,P.jsx)(`span`,{className:`ml-auto text-muted-foreground`,children:e.role===`ADMIN`?`Admin`:`Member`})]})]}),i&&(0,P.jsx)(m,{variant:`outline`,onClick:d,children:`Edit profile`})]})]})]})}var N,P,F,I,L;function R(){return(R=e((()=>{N=t(),a(),d(),T(),O(),j(),x(),_(),y(),c(),p(),b(),P=n(),F=`overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]`,I=`flex items-center gap-3 px-4 py-3 text-small`,L=`shrink-0 text-muted-foreground`,M.__docgenInfo={description:`One Member's page, opened from the /team roster (ADR-0038): their face with the Shirt Number, then
number, Position and Role as a settings list. The member and Admins get an Edit button that swaps
the list for the profile form. Below the face the member sets their Team Photo; an Admin may only
remove it. Prop-only; the route container owns the queries, the mutation and
the editing flag, so every state is a story.`,methods:[],displayName:`MemberDetailView`,props:{member:{required:!1,tsType:{name:`Member`},description:`Undefined while loading, on error, or when the id names nobody on the Roster.`},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},canEdit:{required:!0,tsType:{name:`boolean`},description:`The member themselves, or an Admin (ADR-0038). Role changes stay in team settings.`},isEditing:{required:!0,tsType:{name:`boolean`},description:``},isSaving:{required:!0,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from the update (e.g. NAME_TAKEN, NUMBER_TAKEN), shown inline.`},errorMessage:{required:!1,tsType:{name:`string`},description:`A failed save the form has no field for (e.g. forbidden, member gone), shown above the form.`},onEdit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCancelEdit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null, shirtNumber: number | null) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`},{type:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},name:`shirtNumber`}],return:{name:`void`}}},description:``},canChangePhoto:{required:!0,tsType:{name:`boolean`},description:`Only the member themselves sets their Team Photo (ADR-0038).`},canRemovePhoto:{required:!0,tsType:{name:`boolean`},description:`The member themselves, or an Admin — the one thing an Admin may do to someone's photo.`},hasPersonalPhoto:{required:!0,tsType:{name:`boolean`},description:`The viewer has a Personal Photo to copy into this Team.`},isPhotoSaving:{required:!0,tsType:{name:`boolean`},description:``},photoErrorMessage:{required:!1,tsType:{name:`string`},description:``},onUploadPhoto:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(photo: Blob) => void`,signature:{arguments:[{type:{name:`Blob`},name:`photo`}],return:{name:`void`}}},description:``},onUsePersonalPhoto:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onRemovePhoto:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{r(),g(),R(),z=n(),{expect:B,fn:V,screen:H,userEvent:U,within:W}=__STORYBOOK_MODULE_TEST__,G=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],K={userId:`u1`,displayName:`Ada Lovelace`,role:`ADMIN`,position:G[0],onboarded:!0,shirtNumber:12,photoVersion:void 0},q=h(`team`),J={title:`pages/member/MemberDetailView`,component:M,decorators:q.decorators,parameters:q.parameters,args:{member:K,positions:G,canEdit:!0,isEditing:!1,isSaving:!1,onEdit:V(),onCancelEdit:V(),onSubmit:V(),canChangePhoto:!0,canRemovePhoto:!0,hasPersonalPhoto:!0,isPhotoSaving:!1,onUploadPhoto:V(),onUsePersonalPhoto:V(),onRemovePhoto:V()}},Y={play:async({canvas:e})=>{await B(e.getByRole(`heading`,{name:`Ada Lovelace`})).toBeInTheDocument(),await B(e.getByLabelText(`Shirt number 12`)).toBeInTheDocument(),await B(e.getByText(`Admin`)).toBeInTheDocument(),await B(e.getAllByRole(`link`,{name:`Team`})).toHaveLength(2),await B(e.getByRole(`button`,{name:`Edit profile`})).toBeInTheDocument()}},X={render:e=>(0,z.jsx)(i,{items:{"Read only":(0,z.jsx)(M,{...e,canEdit:!1,canChangePhoto:!1,canRemovePhoto:!1,member:{...K,userId:`u3`,displayName:`Alan Turing`,role:`USER`,position:void 0,shirtNumber:null}}),"Admin, their photo":(0,z.jsx)(M,{...e,canEdit:!0,canChangePhoto:!1,member:{...K,photoVersion:`v1`}}),"Photo upload failed":(0,z.jsx)(M,{...e,hasPersonalPhoto:!1,photoErrorMessage:`That photo is too large. Please pick another one.`}),Editing:(0,z.jsx)(M,{...e,isEditing:!0,errorCode:`NUMBER_TAKEN`}),"Save failed":(0,z.jsx)(M,{...e,isEditing:!0,errorCode:`NOT_FOUND`,errorMessage:`Member not found.`}),Loading:(0,z.jsx)(M,{...e,member:void 0,isLoading:!0}),Error:(0,z.jsx)(M,{...e,member:void 0,isError:!0}),"Not on the team":(0,z.jsx)(M,{...e,member:void 0})}}),play:async({canvas:e})=>{let t=t=>W(e.getByRole(`region`,{name:t}));await B(t(`Read only`).queryByRole(`button`,{name:`Edit profile`})).not.toBeInTheDocument(),await B(t(`Read only`).getByText(`None`)).toBeInTheDocument(),await B(t(`Read only`).getAllByText(`Unassigned`).length).toBeGreaterThan(0),await B(t(`Read only`).queryByLabelText(/^Shirt number/)).not.toBeInTheDocument(),await B(t(`Read only`).queryByRole(`button`,{name:/photo/i})).not.toBeInTheDocument(),await B(t(`Admin, their photo`).getByRole(`button`,{name:`Remove photo`})).toBeInTheDocument(),await B(t(`Admin, their photo`).queryByRole(`button`,{name:/upload/i})).not.toBeInTheDocument(),await B(t(`Admin, their photo`).queryByRole(`button`,{name:`Use my personal photo`})).not.toBeInTheDocument(),await B(t(`Photo upload failed`).getByRole(`button`,{name:`Upload photo`})).toBeInTheDocument(),await B(t(`Photo upload failed`).queryByRole(`button`,{name:`Use my personal photo`})).not.toBeInTheDocument(),await B(t(`Photo upload failed`).queryByRole(`button`,{name:`Remove photo`})).not.toBeInTheDocument(),await B(t(`Photo upload failed`).getByText(`That photo is too large. Please pick another one.`)).toBeInTheDocument(),await B(t(`Editing`).getByLabelText(`Shirt number`)).toHaveValue(`12`),await B(t(`Editing`).getByText(`That shirt number is already taken.`)).toBeInTheDocument(),await B(t(`Save failed`).getByRole(`alert`)).toHaveTextContent(`Member not found.`),await B(t(`Editing`).queryByRole(`alert`)).not.toBeInTheDocument(),await B(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await B(t(`Error`).getByText(/couldn't load this member/i)).toBeInTheDocument(),await B(t(`Not on the team`).getByText(`This person is not on the team.`)).toBeInTheDocument()}},Z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,z.jsx)(i,{items:{Reading:(0,z.jsx)(M,{...e,member:{...K,photoVersion:`v1`}}),Editing:(0,z.jsx)(M,{...e,isEditing:!0})}}),play:async({canvas:e,args:t})=>{let n=t=>W(e.getByRole(`region`,{name:t}));await U.click(n(`Reading`).getByRole(`button`,{name:`Use my personal photo`})),await B(t.onUsePersonalPhoto).toHaveBeenCalledOnce(),await U.click(n(`Reading`).getByRole(`button`,{name:`Remove photo`})),await U.click(W(await H.findByRole(`dialog`)).getByRole(`button`,{name:`Cancel`})),await B(t.onRemovePhoto).not.toHaveBeenCalled(),await U.click(n(`Reading`).getByRole(`button`,{name:`Remove photo`})),await U.click(W(await H.findByRole(`dialog`)).getByRole(`button`,{name:`Remove`})),await B(t.onRemovePhoto).toHaveBeenCalledOnce(),await B(n(`Reading`).getByRole(`button`,{name:`Upload a different photo`})).toBeInTheDocument(),await U.click(n(`Reading`).getByRole(`button`,{name:`Edit profile`})),await B(t.onEdit).toHaveBeenCalledOnce();let r=n(`Editing`),i=r.getByLabelText(`Shirt number`);await U.clear(i),await U.type(i,`1000`),await B(r.getByText(`Use a whole number from 0 to 999.`)).toBeInTheDocument(),await B(r.getByRole(`button`,{name:`Save`})).toBeDisabled(),await U.clear(i),await U.type(i,`07`),await U.click(r.getByRole(`button`,{name:`Save`})),await B(t.onSubmit).toHaveBeenCalledWith(`Ada Lovelace`,`p1`,7),await U.clear(i),await U.click(r.getByRole(`button`,{name:`Save`})),await B(t.onSubmit).toHaveBeenLastCalledWith(`Ada Lovelace`,`p1`,null),await U.click(r.getByRole(`button`,{name:`Cancel`})),await B(t.onCancelEdit).toHaveBeenCalledOnce()}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    // Somebody else's page, seen by a plain member: details only, no Edit.
    'Read only': <MemberDetailView {...args} canEdit={false} canChangePhoto={false} canRemovePhoto={false}
    // shirtNumber null, as the API sends "no number" (the generated type says undefined).
    member={{
      ...ADA,
      userId: 'u3',
      displayName: 'Alan Turing',
      role: 'USER',
      position: undefined,
      shirtNumber: null as unknown as undefined
    }} />,
    // An Admin on someone else's page: the photo can only be removed. (No network in stories, so
    // the photo falls back to initials.)
    'Admin, their photo': <MemberDetailView {...args} canEdit canChangePhoto={false} member={{
      ...ADA,
      photoVersion: 'v1'
    }} />,
    'Photo upload failed': <MemberDetailView {...args} hasPersonalPhoto={false} photoErrorMessage="That photo is too large. Please pick another one." />,
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
    await expect(region('Read only').queryByRole('button', {
      name: /photo/i
    })).not.toBeInTheDocument();
    await expect(region('Admin, their photo').getByRole('button', {
      name: 'Remove photo'
    })).toBeInTheDocument();
    await expect(region('Admin, their photo').queryByRole('button', {
      name: /upload/i
    })).not.toBeInTheDocument();
    await expect(region('Admin, their photo').queryByRole('button', {
      name: 'Use my personal photo'
    })).not.toBeInTheDocument();

    // Nothing to copy and nothing to remove: only the upload.
    await expect(region('Photo upload failed').getByRole('button', {
      name: 'Upload photo'
    })).toBeInTheDocument();
    await expect(region('Photo upload failed').queryByRole('button', {
      name: 'Use my personal photo'
    })).not.toBeInTheDocument();
    await expect(region('Photo upload failed').queryByRole('button', {
      name: 'Remove photo'
    })).not.toBeInTheDocument();
    await expect(region('Photo upload failed').getByText('That photo is too large. Please pick another one.')).toBeInTheDocument();
    await expect(region('Editing').getByLabelText('Shirt number')).toHaveValue('12');
    await expect(region('Editing').getByText('That shirt number is already taken.')).toBeInTheDocument();
    await expect(region('Save failed').getByRole('alert')).toHaveTextContent('Member not found.');
    await expect(region('Editing').queryByRole('alert')).not.toBeInTheDocument();
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText(/couldn't load this member/i)).toBeInTheDocument();
    await expect(region('Not on the team').getByText('This person is not on the team.')).toBeInTheDocument();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Reading: <MemberDetailView {...args} member={{
      ...ADA,
      photoVersion: 'v1'
    }} />,
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
      name: 'Use my personal photo'
    }));
    await expect(args.onUsePersonalPhoto).toHaveBeenCalledOnce();
    // Removing asks first; Cancel leaves the photo alone.
    await userEvent.click(region('Reading').getByRole('button', {
      name: 'Remove photo'
    }));
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onRemovePhoto).not.toHaveBeenCalled();
    await userEvent.click(region('Reading').getByRole('button', {
      name: 'Remove photo'
    }));
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', {
      name: 'Remove'
    }));
    await expect(args.onRemovePhoto).toHaveBeenCalledOnce();
    await expect(region('Reading').getByRole('button', {
      name: 'Upload a different photo'
    })).toBeInTheDocument();
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
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`Interactions`]})))()}$();export{Y as Data,Z as Interactions,X as Shells,Q as __namedExportsOrder,J as default};