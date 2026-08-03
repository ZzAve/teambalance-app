import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-DJeDb2yh.js";import{n as r}from"./event-fixtures-aDtuIL9P.js";import{n as i,t as a}from"./EventCard-D7UFOM1s.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),{expect:o}=__STORYBOOK_MODULE_TEST__,s={title:`entities/event/EventCard`,component:a,decorators:[t]},c={args:{event:r()},play:async({canvas:e})=>{await o(e.getByText(/5 going/)).toBeInTheDocument(),await o(e.getByText(`2 Outside Hitter`)).toBeInTheDocument(),await o(e.getByText(`1 Libero`)).toBeInTheDocument(),await o(e.getByText(`1 Opposite`)).toBeInTheDocument(),await o(e.getByText(`1 Setter`)).toBeInTheDocument()}},l={args:{event:r({attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await o(e.getByText(/0 going/)).toBeInTheDocument(),await o(e.queryByText(/\d+\s+(Setter|Libero|Outside Hitter|Opposite)/)).not.toBeInTheDocument()}},u={args:{event:r({references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await o(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await o(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await o(e.getByText(`+1`)).toBeInTheDocument(),await o(t.querySelectorAll(`a a`)).toHaveLength(0)}},d={args:{event:r({location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await o(n).toHaveAttribute(`href`,o.stringContaining(`maps.google.com`)),await o(n).toHaveAttribute(`target`,`_blank`),await o(t.querySelectorAll(`a a`)).toHaveLength(0)}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f=[`Populated`,`NoResponses`,`WithReferences`,`WithLocation`]})))()}p();export{l as NoResponses,c as Populated,d as WithLocation,u as WithReferences,f as __namedExportsOrder,s as default};