'use client';
import { Button } from '@/components/ui/button';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

const EMAIL = 'kevin.esteban.lichen@gmail.com';

export default function ContactMe() {
  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL);
    toast('Email copied to clipboard!', {
      position: 'bottom-center',
      action: {
        label: 'Close',
        onClick: () => close(),
      },
    });
  };
  return (
    <div className="relative flex flex-col justify-between pt-4 text-left">
      <div className="flex flex-row items-center gap-2 pb-3">
        <h2 className="text-2xl">Contact me</h2>
        {/* <EnvelopeClosedIcon className="size-6 text-white" /> */}
      </div>
      <div className="flex flex-row items-center gap-1">
        <p className="text-lg font-normal text-foreground">{EMAIL}</p>
        <Button
          size="sm"
          variant="ghost"
          className="p-2 active:scale-90"
          onClick={handleCopy}
        >
          <CopyIcon className="size-5 text-sky-950 dark:text-white" />
        </Button>
      </div>
    </div>
  );
}
