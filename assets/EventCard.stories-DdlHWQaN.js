import{i as e}from"./preload-helper-BdFrVu1K.js";import{n as t,t as n}from"./router-decorator-DFoMl2Bq.js";import{n as r,t as i}from"./event-fixtures-CKCzWaqm.js";import{n as a,t as o}from"./EventCard-KbJP05Xu.js";var s,c,l,u,d,f,p;e((()=>{n(),i(),a(),{expect:s}=__STORYBOOK_MODULE_TEST__,c={title:`entities/event/EventCard`,component:o,decorators:[t]},l={args:{event:r()},play:async({canvas:e})=>{await s(e.getByText(/5 going/)).toBeInTheDocument(),await s(e.getByText(`2 Outside Hitter`)).toBeInTheDocument(),await s(e.getByText(`1 Libero`)).toBeInTheDocument(),await s(e.getByText(`1 Opposite`)).toBeInTheDocument(),await s(e.getByText(`1 Setter`)).toBeInTheDocument()}},u={args:{event:r({attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await s(e.getByText(/0 going/)).toBeInTheDocument(),await s(e.queryByText(/\d+\s+(Setter|Libero|Outside Hitter|Opposite)/)).not.toBeInTheDocument()}},d={args:{event:r({references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await s(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await s(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await s(e.getByText(`+1`)).toBeInTheDocument(),await s(t.querySelectorAll(`a a`)).toHaveLength(0)}},f={args:{event:r({location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await s(n).toHaveAttribute(`href`,s.stringContaining(`maps.google.com`)),await s(n).toHaveAttribute(`target`,`_blank`),await s(t.querySelectorAll(`a a`)).toHaveLength(0)}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent()
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/5 going/)).toBeInTheDocument();
    await expect(canvas.getByText('2 Outside Hitter')).toBeInTheDocument();
    await expect(canvas.getByText('1 Libero')).toBeInTheDocument();
    await expect(canvas.getByText('1 Opposite')).toBeInTheDocument();
    await expect(canvas.getByText('1 Setter')).toBeInTheDocument();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      attendanceSummary: {
        attending: 0,
        maybe: 0,
        absent: 0,
        notResponded: 0,
        roleBreakdown: []
      }
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/0 going/)).toBeInTheDocument();
    await expect(canvas.queryByText(/\\d+\\s+(Setter|Libero|Outside Hitter|Opposite)/)).not.toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      references: [{
        title: 'Nevobo',
        url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133'
      }, {
        title: 'Match form',
        url: 'https://dwf.volleybal.nl/match/42'
      }, {
        title: 'Route',
        url: 'https://maps.example.com/hall'
      }]
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // Two chips visible on the card, the third collapsed into "+1".
    await expect(canvas.getByRole('link', {
      name: /Nevobo/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: /Match form/
    })).toBeInTheDocument();
    await expect(canvas.getByText('+1')).toBeInTheDocument();
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      location: 'Sporthal De Boog'
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // The location renders as a real maps link that opens in a new tab...
    const maps = canvas.getByRole('link', {
      name: 'Sporthal De Boog'
    });
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    await expect(maps).toHaveAttribute('target', '_blank');
    // ...and it must NOT be nested inside the card's own <Link> anchor (invalid HTML — the
    // "<a> cannot contain a nested <a>" warning this fix removes). The card link and the maps
    // link are siblings; the card stays clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...f.parameters?.docs?.source}}},p=[`Populated`,`NoResponses`,`WithReferences`,`WithLocation`]}))();export{u as NoResponses,l as Populated,f as WithLocation,d as WithReferences,p as __namedExportsOrder,c as default};