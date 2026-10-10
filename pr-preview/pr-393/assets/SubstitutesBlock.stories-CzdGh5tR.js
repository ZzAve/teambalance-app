import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{c as i,i as a,r as o}from"./event-fixtures-C1ds5yXh.js";import{i as s,r as c}from"./SubstitutesBlock-B2tpoFlj.js";var l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{o(),n(),s(),l=t(),{expect:u,fn:d,within:f}=__STORYBOOK_MODULE_TEST__,p=[a(`u-eva`,`Eva Smit`,`Outside`),a(`u-me`,`Sanne Vos`,`Setter`)],m=[i(`sub-1`,`Jan de Vries`,{position:{id:`pos-libero`,label:`Libero`},changedBy:`u-eva`}),i(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),i(`sub-3`,`Pieter Smit`,{state:`ABSENT`})],h={title:`features/call-in-substitutes/SubstitutesBlock`,component:c,args:{substitutes:m,members:p,onSetState:d(),onOpen:d(),onCallIn:d()}},g={render:e=>(0,l.jsx)(r,{items:{Empty:(0,l.jsx)(c,{...e,substitutes:[]}),Pending:(0,l.jsx)(c,{...e,pending:!0})}}),play:async({canvas:e})=>{let t=t=>f(e.getByRole(`region`,{name:t}));await u(t(`Empty`).getByText(`none yet`)).toBeInTheDocument(),await u(t(`Empty`).getByText(`Nobody called in yet.`)).toBeInTheDocument();let n=t(`Pending`);await u(f(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Going`})).toBeDisabled(),await u(n.getByRole(`button`,{name:/^Jan de Vries/})).toBeEnabled(),await u(n.getByRole(`button`,{name:`Call in substitutes`})).toBeEnabled()}},_={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e,userEvent:t,args:n})=>{let r=f(e.getByRole(`region`,{name:`Substitutes`}));await u(r.getByText(`1 going`)).toBeInTheDocument(),await u(r.getByText(`1 asked`)).toBeInTheDocument(),await u(r.getByText(`1 can't`)).toBeInTheDocument(),await u(r.getByText(`Libero · set by Eva Smit`)).toBeInTheDocument();let i=e=>f(r.getByRole(`group`,{name:e}));await t.click(i(`Mila Jansen`).getByRole(`button`,{name:`Going`})),await u(n.onSetState).toHaveBeenCalledWith(`sub-2`,`ATTENDING`),await t.click(i(`Jan de Vries`).getByRole(`button`,{name:`Asked`})),await u(n.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await t.click(i(`Pieter Smit`).getByRole(`button`,{name:`Can't`})),await u(n.onSetState).toHaveBeenCalledWith(`sub-3`,`ABSENT`),await u(n.onSetState).toHaveBeenCalledTimes(3);for(let e of[`Jan de Vries`,`Mila Jansen`,`Pieter Smit`])for(let t of[`Going`,`Asked`,`Can't`]){let n=i(e).getByRole(`button`,{name:t});n.scrollIntoView({block:`center`});let r=n.getBoundingClientRect(),a=(44-r.height)/2-1;for(let e of[r.top-a,r.bottom+a])await u(document.elementFromPoint(r.left+r.width/2,e)).toBe(n)}await t.click(r.getByRole(`button`,{name:/^Mila Jansen/})),await u(n.onOpen).toHaveBeenCalledWith(`sub-2`),await t.click(r.getByRole(`button`,{name:`Call in substitutes`})),await u(n.onCallIn).toHaveBeenCalled()}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Empty: <SubstitutesBlock {...args} substitutes={[]} />,
    Pending: <SubstitutesBlock {...args} pending />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Empty').getByText('none yet')).toBeInTheDocument();
    await expect(region('Empty').getByText('Nobody called in yet.')).toBeInTheDocument();
    // A write in flight holds every state pill, but not the row or the call-in button.
    const pending = region('Pending');
    await expect(within(pending.getByRole('group', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Going'
    })).toBeDisabled();
    await expect(pending.getByRole('button', {
      name: /^Jan de Vries/
    })).toBeEnabled();
    await expect(pending.getByRole('button', {
      name: 'Call in substitutes'
    })).toBeEnabled();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
    const block = within(canvas.getByRole('region', {
      name: 'Substitutes'
    }));
    await expect(block.getByText('1 going')).toBeInTheDocument();
    await expect(block.getByText('1 asked')).toBeInTheDocument();
    await expect(block.getByText("1 can't")).toBeInTheDocument();
    await expect(block.getByText('Libero · set by Eva Smit')).toBeInTheDocument();

    // Each pill reports its own row: a mis-tap here records the wrong person for the whole team
    // (ADR-0003), which is why the target has to be the full 44px (#388).
    const row = (name: string) => within(block.getByRole('group', {
      name
    }));
    await userEvent.click(row('Mila Jansen').getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ATTENDING');
    await userEvent.click(row('Jan de Vries').getByRole('button', {
      name: 'Asked'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE');
    await userEvent.click(row('Pieter Smit').getByRole('button', {
      name: "Can't"
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ABSENT');
    await expect(args.onSetState).toHaveBeenCalledTimes(3);

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7), and never
    // on the neighbouring row's pill.
    for (const name of ['Jan de Vries', 'Mila Jansen', 'Pieter Smit']) {
      for (const label of ['Going', 'Asked', "Can't"]) {
        const pill = row(name).getByRole('button', {
          name: label
        });
        pill.scrollIntoView({
          block: 'center'
        });
        const box = pill.getBoundingClientRect();
        const reach = (44 - box.height) / 2 - 1;
        for (const y of [box.top - reach, box.bottom + reach]) {
          await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill);
        }
      }
    }

    // The name opens the Substitute's sheet; the footer opens the picker.
    await userEvent.click(block.getByRole('button', {
      name: /^Mila Jansen/
    }));
    await expect(args.onOpen).toHaveBeenCalledWith('sub-2');
    await userEvent.click(block.getByRole('button', {
      name: 'Call in substitutes'
    }));
    await expect(args.onCallIn).toHaveBeenCalled();
  }
}`,..._.parameters?.docs?.source}}},v=[`Shells`,`Interactions`]})))()}y();export{_ as Interactions,g as Shells,v as __namedExportsOrder,h as default};