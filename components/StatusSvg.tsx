interface StatusSvgProps {
  className?: string;
  role?: string;
  'aria-label'?: string;
}

export default function StatusSvg(props: StatusSvgProps) {
  return (
    <svg
      width="48"
      height="134"
      viewBox="0 0 48 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
      role={props.role}
      aria-label={props['aria-label']}
    >
      <style>{`
        .light { fill: #7E7B7B }
        svg.red .top { fill: #F26A67 }
        svg.red .middle, svg.red .bottom { fill: #7E7B7B }
        svg.yellow .middle { fill: #FBA833 }
        svg.yellow .top, svg.yellow .bottom { fill: #7E7B7B }
        svg.green .bottom { fill: #6CC198 }
        svg.green .top, svg.green .middle { fill: #7E7B7B }
      `}</style>
      <rect width="48" height="134" rx="24" fill="black" />
      <circle className="bottom light" cx="24" cy="110" r="19" />
      <circle className="middle light" cx="24" cy="67" r="19" />
      <circle className="top light" cx="24" cy="24" r="19" />
    </svg>
  );
}
