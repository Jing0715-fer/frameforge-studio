'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { copyText } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  onCopied?: () => void
  silent?: boolean
  variant?: 'default' | 'ghost' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  toastMessage?: string
}

export function CopyButton({
  text,
  label = '复制',
  copiedLabel = '已复制',
  onCopied,
  silent = false,
  variant = 'outline',
  size = 'sm',
  className,
  toastMessage = '已复制到剪贴板',
}: CopyButtonProps) {
  const [ok, setOk] = useState(false)

  async function handleCopy() {
    const success = await copyText(text)
    if (success) {
      setOk(true)
      setTimeout(() => setOk(false), 1800)
      if (!silent) toast.success(toastMessage)
      onCopied?.()
    } else {
      toast.error('复制失败，请手动选择复制')
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(ok && 'border-emerald-500/50 text-emerald-400', className)}
      aria-label={label}
    >
      {ok ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label ? <span>{ok ? copiedLabel : label}</span> : null}
    </Button>
  )
}
