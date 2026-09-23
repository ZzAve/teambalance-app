import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-D4FUF-yi.js";import{n as r,t as i}from"./BottomNav-Hh7_rc5Q.js";async function a(e){await o(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/t/setpoint-vt`),await o(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`href`,`/t/setpoint-vt/team`),await o(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`href`,`/t/setpoint-vt/money`),await o(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await o(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`pointer-events-none`),await o(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`pointer-events-none`),await o(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`pointer-events-none`),await o(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`pointer-events-none`)}var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),r(),{expect:o}=__STORYBOOK_MODULE_TEST__,s={title:`shared/ui/BottomNav`,component:i,decorators:[t]},c={parameters:{router:{initialEntries:[`/t/setpoint-vt`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await a(e),await o(e.getByRole(`link`,{name:`Events`})).toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`aria-current`,`page`),await o(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},l={parameters:{router:{initialEntries:[`/t/setpoint-vt/team`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await a(e),await o(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Team`})).toHaveAttribute(`aria-current`,`page`),await o(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},u={parameters:{router:{initialEntries:[`/t/setpoint-vt/money`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await a(e),await o(e.getByRole(`link`,{name:`Money`})).toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Money`})).toHaveAttribute(`aria-current`,`page`),await o(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Profile`})).not.toHaveClass(`text-blue`)}},d={parameters:{router:{initialEntries:[`/t/setpoint-vt/team/settings`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await o(e.getByRole(`link`,{name:`Team`})).toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`)}},f={parameters:{router:{initialEntries:[`/account`]},chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await o(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`href`,`/account`),await o(e.getByRole(`link`,{name:`Profile`})).toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Profile`})).toHaveAttribute(`aria-current`,`page`),await o(e.getByRole(`link`,{name:`Events`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Team`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Money`})).not.toHaveClass(`text-blue`),await o(e.getByRole(`link`,{name:`Events`})).toHaveAttribute(`href`,`/`)}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    router: {
      initialEntries: ['/account']
    },
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
    // With no slug in scope the non-Profile tabs point at the dispatcher.
    await expect(canvas.getByRole('link', {
      name: 'Events'
    })).toHaveAttribute('href', '/');
  }
}`,...f.parameters?.docs?.source}}},p=[`EventsActive`,`TeamActive`,`MoneyActive`,`TeamSettingsActive`,`ProfileActive`]})))()}m();export{c as EventsActive,u as MoneyActive,f as ProfileActive,l as TeamActive,d as TeamSettingsActive,p as __namedExportsOrder,s as default};