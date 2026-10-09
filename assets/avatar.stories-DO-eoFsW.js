import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./stack-DUXBP51x.js";import{n as i,t as a}from"./avatar-DrLdZk-A.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l=`data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20256%20256%22%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20fill%3D%22%232f6f4f%22%2F%3E%3Ccircle%20cx%3D%22128%22%20cy%3D%22104%22%20r%3D%2248%22%20fill%3D%22%23f2c14e%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%22168%22%20width%3D%22144%22%20height%3D%2288%22%20rx%3D%2264%22%20fill%3D%22%23f2c14e%22%2F%3E%3C%2Fsvg%3E`,u={title:`shared/ui/Avatar`,component:a,args:{userId:`u1`,name:`Ada Lovelace`}},d={render:e=>(0,o.jsx)(r,{items:{Initials:(0,o.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,o.jsx)(a,{...e,size:`sm`}),(0,o.jsx)(a,{...e,size:`md`}),(0,o.jsx)(a,{...e,size:`lg`})]}),Photo:(0,o.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,o.jsx)(a,{...e,size:`sm`,photoUrl:l}),(0,o.jsx)(a,{...e,size:`md`,photoUrl:l}),(0,o.jsx)(a,{...e,size:`lg`,photoUrl:l})]}),"Photo fails to load":(0,o.jsx)(a,{...e,size:`md`,photoUrl:`/no-such-photo.webp`})}}),play:async({canvas:e})=>{let t=t=>e.getByRole(`region`,{name:t});await s(t(`Initials`)).toHaveTextContent(`AL`),await s(t(`Photo`).querySelectorAll(`img`)).toHaveLength(3),await s(await c(t(`Photo fails to load`)).findByText(`AL`)).toBeInTheDocument(),await s(t(`Photo fails to load`).querySelector(`img`)).toBeNull()}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Initials: <div className="flex items-center gap-3">
            <Avatar {...args} size="sm" />
            <Avatar {...args} size="md" />
            <Avatar {...args} size="lg" />
          </div>,
    Photo: <div className="flex items-center gap-3">
            <Avatar {...args} size="sm" photoUrl={PHOTO} />
            <Avatar {...args} size="md" photoUrl={PHOTO} />
            <Avatar {...args} size="lg" photoUrl={PHOTO} />
          </div>,
    // A photo that cannot be fetched shows the initials, never a broken image.
    'Photo fails to load': <Avatar {...args} size="md" photoUrl="/no-such-photo.webp" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => canvas.getByRole('region', {
      name
    });
    await expect(region('Initials')).toHaveTextContent('AL');
    await expect(region('Photo').querySelectorAll('img')).toHaveLength(3);
    await expect(await within(region('Photo fails to load')).findByText('AL')).toBeInTheDocument();
    await expect(region('Photo fails to load').querySelector('img')).toBeNull();
  }
}`,...d.parameters?.docs?.source}}},f=[`Data`]})))()}p();export{d as Data,f as __namedExportsOrder,u as default};