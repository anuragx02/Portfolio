import React from 'react';
const getPath=()=>window.location.hash.slice(1)||'/';
const C=React.createContext('/');
export function FileRouter({children}:any){const [path,S]=React.useState(getPath);React.useEffect(()=>{const f=()=>{S(getPath());window.scrollTo(0,0)};window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f)},[]);return <C.Provider value={path}>{children}</C.Provider>}
export function Link({to,children,...props}:any){return <a href={'#'+to} {...props}>{children}</a>}
export function NavLink({to,children,end,...props}:any){const p=React.useContext(C);return <a href={'#'+to} className={p===to?'active':''} aria-current={p===to?'page':undefined} {...props}>{children}</a>}
export function Route(_:any){return null}
export function Routes({children}:any){const p=React.useContext(C);const c=React.Children.toArray(children).flatMap((a:any)=>Array.isArray(a)?a:[a]);const match=c.find((x:any)=>x.props?.path===p)||c.find((x:any)=>x.props?.path==='*');return match?.props.element||null}
export function FileCard({children}:any){return <main className="page">{children}</main>}
export function Group({label,children,heading}:any){return <section className="group">{label&&(heading?<h2>{label}</h2>:<p>{label}</p>)}{children}</section>}
export function Header({title,intro,fact}:any){return <header className="page-head">{fact&&<small>{fact}</small>}<h1>{title}</h1>{intro&&<p>{intro}</p>}</header>}
export function Closing({children}:any){return <footer className="closing">{children}</footer>}
export function Facts({items}:any){return <dl className="facts">{items.map((x:any)=><div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>}
export function Callout({title,children,tone}:any){return <aside className={'callout '+(tone||'')}><h3>{title}</h3><div>{children}</div></aside>}
export function ChoiceRow({label,options,value,onChange}:any){return <fieldset className="choice"><legend>{label}</legend><div>{options.map((o:any)=><button key={o.value} aria-pressed={value===o.value} onClick={()=>onChange(o.value)}>{o.label}</button>)}</div></fieldset>}
export function TextLink({children,...p}:any){return <a {...p} target="_blank" rel="noreferrer">{children}</a>}
