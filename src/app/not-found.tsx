import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div className="flex min-h-screen">
      <Result
        status="404"
        title="Pagina nu există"
        subTitle="Ne pare rău, pagina care ați accesat-o nu există."
        extra={
          <Button type="primary" href="/">
            Pagina principală
          </Button>
        }
        className="m-auto"
      />
    </div>
  );
}
