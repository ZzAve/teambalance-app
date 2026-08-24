import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n}from"./event-fixtures-BaYeuP-I.js";import{n as r,t as i}from"./BulkAttendButtonView-D-zbBTjR.js";function a({groups:e,onAttend:t,pendingTypeId:n=null}){return e.length===0?null:(0,o.jsx)(`div`,{className:`mt-3 flex flex-wrap items-center justify-end gap-2`,children:e.map(e=>(0,o.jsx)(i,{count:e.events.length,typeName:e.typeName,isPending:n===e.typeId,onAttend:()=>t(e.typeId)},e.typeId))})}var o;function s(){return(s=e((()=>{r(),o=t(),a.__docgenInfo={description:`One "Attend N <type>" button per event type with blanks left (ADR-0021).

Presentational: the groups and the callback come in as props, the mutation and the Undo toast
live in the container. Renders nothing when there are no groups, so a fully-answered list reserves
no empty row.

Wraps rather than scrolls: a team with several event types gets a second line instead of buttons
sliding out of reach off the edge, which on a phone is the difference between an action you can
see and one you cannot.`,methods:[],displayName:`BulkAttendBarView`,props:{groups:{required:!0,tsType:{name:`Array`,elements:[{name:`EligibleTypeGroup`}],raw:`EligibleTypeGroup[]`},description:``},onAttend:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},pendingTypeId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The type whose batch is in flight, if any.`,defaultValue:{value:`null`,computed:!1}}}}})))()}var c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{s(),{expect:c,fn:l,within:u}=__STORYBOOK_MODULE_TEST__,d=(e,t,r)=>({typeId:e,typeName:t,events:Array.from({length:r},(t,r)=>n({id:`${e}-${r}`}))}),f={title:`features/bulk-attend/BulkAttendBarView`,component:a,args:{groups:[d(`et-training`,`Training`,12),d(`et-match`,`Match`,3)],onAttend:l()}},p={args:{groups:[]},play:async({canvasElement:e})=>{await c(u(e).queryByRole(`button`)).not.toBeInTheDocument()}},m={play:async({canvas:e})=>{await c(e.getByRole(`button`,{name:`Attend 12 trainings`})).toBeInTheDocument(),await c(e.getByRole(`button`,{name:`Attend 3 matches`})).toBeInTheDocument()}},h={args:{groups:[d(`et-training`,`Training`,8)]},play:async({canvas:e})=>{await c(e.getByRole(`button`,{name:`Attend 8 trainings`})).toBeInTheDocument(),await c(e.getAllByRole(`button`)).toHaveLength(1)}},g={args:{groups:[d(`et-training`,`Training`,9),d(`et-match`,`Match`,4),d(`et-social`,`Social`,2),d(`et-tournament`,`Tournament`,1)]},play:async({canvas:e})=>{await c(e.getAllByRole(`button`)).toHaveLength(4),await c(e.getByRole(`button`,{name:`Attend 1 tournament`})).toBeInTheDocument()}},_={args:{pendingTypeId:`et-training`},play:async({canvas:e})=>{await c(e.getByRole(`button`,{name:`Attend 12 trainings`})).toBeDisabled(),await c(e.getByRole(`button`,{name:`Attend 3 matches`})).toBeEnabled()}},v={play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:`Attend 3 matches`})),await c(t.onAttend).toHaveBeenCalledWith(`et-match`)}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    groups: []
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 12 trainings'
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: 'Attend 3 matches'
    })).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [group('et-training', 'Training', 8)]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 8 trainings'
    })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    groups: [group('et-training', 'Training', 9), group('et-match', 'Match', 4), group('et-social', 'Social', 2), group('et-tournament', 'Tournament', 1)]
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
    // Singular noun on the one-event group.
    await expect(canvas.getByRole('button', {
      name: 'Attend 1 tournament'
    })).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    pendingTypeId: 'et-training'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('button', {
      name: 'Attend 12 trainings'
    })).toBeDisabled();
    await expect(canvas.getByRole('button', {
      name: 'Attend 3 matches'
    })).toBeEnabled();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    args,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Attend 3 matches'
    }));
    await expect(args.onAttend).toHaveBeenCalledWith('et-match');
  }
}`,...v.parameters?.docs?.source}}},y=[`Hidden`,`PerType`,`SingleType`,`ManyTypes`,`OneTypePending`,`TapReportsItsType`]})))()}b();export{p as Hidden,g as ManyTypes,_ as OneTypePending,m as PerType,h as SingleType,v as TapReportsItsType,y as __namedExportsOrder,f as default};