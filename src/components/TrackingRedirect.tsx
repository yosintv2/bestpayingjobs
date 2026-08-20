import trackingRedirects from "@/data/tracking-redirects.json";

const redirectMap = trackingRedirects as Record<string, string>;

interface Props {
  param?: string;
}

export default function TrackingRedirect({ param = "src" }: Props) {
  const script = `(function(){try{
    var p=new URLSearchParams(window.location.search);
    var s=p.get(${JSON.stringify(param)});
    if(!s)return;
    var m=${JSON.stringify(redirectMap)};
    var d=m[s];
    if(!d&&(/^https?:\\/\\//i.test(s)||s.indexOf("/")===0))d=s;
    if(!d)d=m["default"];
    if(!d)return;
    var meta=document.createElement("meta");
    meta.name="robots";
    meta.content="noindex, nofollow";
    document.head.appendChild(meta);
    window.location.replace(d.replace(/\\{src\\}/g,s));
  }catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}