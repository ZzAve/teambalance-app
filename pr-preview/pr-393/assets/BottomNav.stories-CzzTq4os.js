import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-CR6DC9ME.js";import{a as r,i,n as a,o,r as s}from"./auth-decorator-AzkEnJZZ.js";async function c(e){await l(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await l(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await l(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`),await l(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await l(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await l(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await l(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`pointer-events-none`),await l(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`)}var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{n(),s(),o(),{expect:l}=__STORYBOOK_MODULE_TEST__,u={title:`shared/ui/BottomNav`,component:r,decorators:[i,t]},d={parameters:{router:{initialEntries:[`/t/setpoint-vt`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await c(e),await l(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await l(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},f={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await c(e),await l(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await l(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},p={parameters:{router:{initialEntries:[`/t/setpoint-vt/money`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await c(e),await l(e.getByRole(`link`,{name:`Money`})).toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`),await l(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},m={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},h={parameters:{router:{initialEntries:[`/account`]},authMe:a({id:`t1`,name:`Setpoint VT`,slug:`setpoint-vt`}),chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await l(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await l(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await l(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await l(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await l(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`)}},g={parameters:{router:{initialEntries:[`/account`]},authMe:a(void 0),chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await l(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/`),await l(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/`),await l(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt']
    },
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/team']
    },
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('aria-current', 'page');
    // Events must not stay active on a nested route — an exact-match seam, not a prefix match.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/money']
    },
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expectTabTargets(canvas);
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).not.toHaveClass('text-blue');
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/t/setpoint-vt/team/settings']
    },
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/account']
    },
    authMe: authenticatedUser({
      id: 't1',
      name: 'Setpoint VT',
      slug: 'setpoint-vt'
    }),
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('href', '/account');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).not.toHaveClass('text-blue');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).not.toHaveClass('text-blue');
    // The tabs open the Active Team's screens, not the dispatcher.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('href', '/t/setpoint-vt');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('href', '/t/setpoint-vt/team');
    await expect(canvas.getByRole('link', {
      name: 'Money'
    })).toHaveAttribute('href', '/t/setpoint-vt/money');
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/account']
    },
    authMe: authenticatedUser(undefined),
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('link', {
      name: 'Team'
    })).toHaveAttribute('href', '/');
    await expect(canvas.getByRole('link', {
      name: 'Profile'
    })).toHaveAttribute('href', '/account');
  }
}`,...g.parameters?.docs?.source}}},_=[`EventsActive`,`TeamActive`,`MoneyActive`,`TeamSettingsActive`,`ProfileActive`,`ProfileActiveTeamless`]})))()}v();export{d as EventsActive,p as MoneyActive,h as ProfileActive,g as ProfileActiveTeamless,f as TeamActive,m as TeamSettingsActive,_ as __namedExportsOrder,u as default};