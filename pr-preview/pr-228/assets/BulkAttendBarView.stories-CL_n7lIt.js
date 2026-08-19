import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{i as n,r}from"./event-fixtures-lW1LLQhc.js";import{n as i,t as a}from"./BulkAttendButtonView-BCnoznuz.js";function o({groups:e,onAttend:t,pendingTypeId:n=null}){return e.length===0?null:(0,s.jsx)(`div`,{className:`mt-3 flex flex-wrap items-center justify-end gap-2`,children:e.map(e=>(0,s.jsx)(a,{count:e.events.length,typeName:e.typeName,isPending:n===e.typeId,onAttend:()=>t(e.typeId)},e.typeId))})}var s;function c(){return(c=e((()=>{i(),s=t(),o.__docgenInfo={description:`One "Attend N <type>" button per event type with blanks left (ADR-0021).

Presentational: the groups and the callback come in as props, the mutation and the Undo toast
live in the container. Renders nothing when there are no groups, so a fully-answered list reserves
no empty row.

Wraps rather than scrolls: a team with several event types gets a second line instead of buttons
sliding out of reach off the edge, which on a phone is the difference between an action you can
see and one you cannot.`,methods:[],displayName:`BulkAttendBarView`,props:{groups:{required:!0,tsType:{name:`Array`,elements:[{name:`EligibleTypeGroup`}],raw:`EligibleTypeGroup[]`},description:``},onAttend:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(typeId: string) => void`,signature:{arguments:[{type:{name:`string`},name:`typeId`}],return:{name:`void`}}},description:``},pendingTypeId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The type whose batch is in flight, if any.`,defaultValue:{value:`null`,computed:!1}}}}})))()}var l,u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),c(),{expect:l,fn:u,within:d}=__STORYBOOK_MODULE_TEST__,f=(e,t,r)=>({typeId:e,typeName:t,events:Array.from({length:r},(t,r)=>n({id:`${e}-${r}`}))}),p={title:`features/bulk-attend/BulkAttendBarView`,component:o,args:{groups:[f(`et-training`,`Training`,12),f(`et-match`,`Match`,3)],onAttend:u()}},m={args:{groups:[]},play:async({canvasElement:e})=>{await l(d(e).queryByRole(`button`)).not.toBeInTheDocument()}},h={play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Attend 12 trainings`})).toBeInTheDocument(),await l(e.getByRole(`button`,{name:`Attend 3 matches`})).toBeInTheDocument()}},g={args:{groups:[f(`et-training`,`Training`,8)]},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Attend 8 trainings`})).toBeInTheDocument(),await l(e.getAllByRole(`button`)).toHaveLength(1)}},_={args:{groups:[f(`et-training`,`Training`,9),f(`et-match`,`Match`,4),f(`et-social`,`Social`,2),f(`et-tournament`,`Tournament`,1)]},play:async({canvas:e})=>{await l(e.getAllByRole(`button`)).toHaveLength(4),await l(e.getByRole(`button`,{name:`Attend 1 tournament`})).toBeInTheDocument()}},v={args:{pendingTypeId:`et-training`},play:async({canvas:e})=>{await l(e.getByRole(`button`,{name:`Attend 12 trainings`})).toBeDisabled(),await l(e.getByRole(`button`,{name:`Attend 3 matches`})).toBeEnabled()}},y={play:async({canvas:e,args:t,userEvent:n})=>{await n.click(e.getByRole(`button`,{name:`Attend 3 matches`})),await l(t.onAttend).toHaveBeenCalledWith(`et-match`)}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    groups: []
  },
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b=[`Hidden`,`PerType`,`SingleType`,`ManyTypes`,`OneTypePending`,`TapReportsItsType`]})))()}x();export{m as Hidden,_ as ManyTypes,v as OneTypePending,h as PerType,g as SingleType,y as TapReportsItsType,b as __namedExportsOrder,p as default};