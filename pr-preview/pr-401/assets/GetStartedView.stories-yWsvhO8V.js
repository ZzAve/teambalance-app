import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DcZd0tzw.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{r as a,t as o}from"./app-column-decorator-BMFswTIv.js";import{n as s,t as c}from"./EditProfileForm-CTSTzwpU.js";function l({member:e,positions:t,isLoading:n,isError:r,isSaving:i,errorCode:a,hasPersonalPhoto:o,onSubmit:s}){let[l,f]=(0,u.useState)(!0);return(0,d.jsxs)(`div`,{className:`mx-auto mt-10 max-w-sm`,children:[(0,d.jsx)(`h1`,{className:`font-display text-title font-bold`,children:`Welcome to TeamBalance`}),(0,d.jsx)(`p`,{className:`mt-2 text-small text-muted-foreground`,children:`Let's set up your profile — tell us your name and where you play.`}),n&&(0,d.jsx)(`p`,{className:`mt-6 text-small text-muted-foreground`,children:`Loading…`}),r&&(0,d.jsx)(`p`,{className:`mt-6 text-small text-red`,children:`Couldn't load your profile. Please try again.`}),e&&(0,d.jsxs)(`div`,{className:`mt-6 flex flex-col gap-4`,children:[o&&(0,d.jsxs)(`label`,{className:`flex items-center gap-2 text-small`,children:[(0,d.jsx)(`input`,{type:`checkbox`,className:`size-4 accent-green`,checked:l,onChange:e=>f(e.target.checked)}),`Use my personal photo in this team`]}),(0,d.jsx)(c,{currentName:e.displayName,positions:t,currentPositionId:e.position?.id??null,withShirtNumber:!0,currentShirtNumber:e.shirtNumber??null,isSaving:i,errorCode:a,onSubmit:(e,t,n)=>s(e,t,n,o&&l)})]})]})}var u,d;function f(){return(f=e((()=>{u=t(),s(),d=n(),l.__docgenInfo={description:`The one-time onboarding screen: name, position and Shirt Number, plus — when the member already
has a Personal Photo — a pre-ticked offer to use it in this Team, the moment that copy most often
happens (ADR-0038). Prop-only; the route container owns the queries and the mutations.`,methods:[],displayName:`GetStartedView`,props:{member:{required:!1,tsType:{name:`Member`},description:``},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`Position`}],raw:`Position[]`},description:``},isLoading:{required:!0,tsType:{name:`boolean`},description:``},isError:{required:!0,tsType:{name:`boolean`},description:``},isSaving:{required:!0,tsType:{name:`boolean`},description:``},errorCode:{required:!1,tsType:{name:`string`},description:`Backend error discriminator from onboarding (NAME_TAKEN, NUMBER_TAKEN), shown inline.`},hasPersonalPhoto:{required:!0,tsType:{name:`boolean`},description:`The member has a Personal Photo, so the copy can be offered (ADR-0038).`},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null, shirtNumber: number | null, usePersonalPhoto: boolean) => void`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`},{type:{name:`union`,raw:`number | null`,elements:[{name:`number`},{name:`null`}]},name:`shirtNumber`},{type:{name:`boolean`},name:`usePersonalPhoto`}],return:{name:`void`}}},description:``}}}})))()}var p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{a(),r(),f(),p=n(),{expect:m,fn:h,userEvent:g,within:_}=__STORYBOOK_MODULE_TEST__,v=[{id:`p1`,label:`Setter`,kind:`PLAYING`},{id:`p2`,label:`Libero`,kind:`PLAYING`}],y={userId:`u1`,displayName:`Alex`,role:`USER`,position:v[0],onboarded:!1,shirtNumber:7,photoVersion:void 0},b={title:`pages/get-started/GetStartedView`,component:l,decorators:o.decorators,args:{member:y,positions:v,isLoading:!1,isError:!1,isSaving:!1,hasPersonalPhoto:!0,onSubmit:h()}},x={play:async({canvas:e})=>{await m(e.getByLabelText(`Shirt number`)).toHaveValue(`7`),await m(e.getByRole(`checkbox`,{name:`Use my personal photo in this team`})).toBeChecked()}},S={render:e=>(0,p.jsx)(i,{items:{"No personal photo":(0,p.jsx)(l,{...e,hasPersonalPhoto:!1}),"Number taken":(0,p.jsx)(l,{...e,errorCode:`NUMBER_TAKEN`}),Loading:(0,p.jsx)(l,{...e,member:void 0,isLoading:!0}),Error:(0,p.jsx)(l,{...e,member:void 0,isError:!0})}}),play:async({canvas:e})=>{let t=t=>_(e.getByRole(`region`,{name:t}));await m(t(`No personal photo`).queryByRole(`checkbox`)).not.toBeInTheDocument(),await m(t(`Number taken`).getByText(`That shirt number is already taken.`)).toBeInTheDocument(),await m(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await m(t(`Error`).getByText(`Couldn't load your profile. Please try again.`)).toBeInTheDocument()}},C={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,p.jsx)(i,{items:{"With photo":(0,p.jsx)(l,{...e}),"Without photo":(0,p.jsx)(l,{...e,hasPersonalPhoto:!1})}}),play:async({canvas:e,args:t})=>{let n=_(e.getByRole(`region`,{name:`With photo`})),r=n.getByLabelText(`Shirt number`);await g.clear(r),await g.type(r,`10`),await g.click(n.getByRole(`button`,{name:`Save`})),await m(t.onSubmit).toHaveBeenLastCalledWith(`Alex`,`p1`,10,!0),await g.click(n.getByRole(`checkbox`,{name:`Use my personal photo in this team`})),await g.click(n.getByRole(`button`,{name:`Save`})),await m(t.onSubmit).toHaveBeenLastCalledWith(`Alex`,`p1`,10,!1);let i=_(e.getByRole(`region`,{name:`Without photo`}));await g.click(i.getByRole(`button`,{name:`Save`})),await m(t.onSubmit).toHaveBeenLastCalledWith(`Alex`,`p1`,7,!1)}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByLabelText('Shirt number')).toHaveValue('7');
    await expect(canvas.getByRole('checkbox', {
      name: 'Use my personal photo in this team'
    })).toBeChecked();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    'No personal photo': <GetStartedView {...args} hasPersonalPhoto={false} />,
    'Number taken': <GetStartedView {...args} errorCode="NUMBER_TAKEN" />,
    Loading: <GetStartedView {...args} member={undefined} isLoading />,
    Error: <GetStartedView {...args} member={undefined} isError />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('No personal photo').queryByRole('checkbox')).not.toBeInTheDocument();
    await expect(region('Number taken').getByText('That shirt number is already taken.')).toBeInTheDocument();
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Error').getByText("Couldn't load your profile. Please try again.")).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'With photo': <GetStartedView {...args} />,
    'Without photo': <GetStartedView {...args} hasPersonalPhoto={false} />
  }} />,
  play: async ({
    canvas,
    args
  }) => {
    const withPhoto = within(canvas.getByRole('region', {
      name: 'With photo'
    }));
    const number = withPhoto.getByLabelText('Shirt number');
    await userEvent.clear(number);
    await userEvent.type(number, '10');
    await userEvent.click(withPhoto.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 10, true);
    await userEvent.click(withPhoto.getByRole('checkbox', {
      name: 'Use my personal photo in this team'
    }));
    await userEvent.click(withPhoto.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 10, false);

    // Nothing to copy, so never asks for one.
    const withoutPhoto = within(canvas.getByRole('region', {
      name: 'Without photo'
    }));
    await userEvent.click(withoutPhoto.getByRole('button', {
      name: 'Save'
    }));
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Alex', 'p1', 7, false);
  }
}`,...C.parameters?.docs?.source}}},w=[`Data`,`Shells`,`Interactions`]})))()}T();export{x as Data,C as Interactions,S as Shells,w as __namedExportsOrder,b as default};