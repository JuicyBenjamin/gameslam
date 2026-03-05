import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { slamsCollection } from '@/collections'

export const ShareSection = () => {
  const { id: slamId } = useParams({ from: '/slams/show/$id/' })
  const loaderData = useLoaderData({ from: '/slams/show/$id/' })

  const { data: slams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.id, slamId)),
  )

  const slamName = slams[0]?.slam.name || loaderData.slam.slam.name

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href
    const text = `Check out this awesome Game Slam: ${slamName}`

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
        )
        break
      case 'bluesky':
        window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${shareUrl}`)}`, '_blank')
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast.success('Link copied!', {
            description: 'The slam link has been copied to your clipboard.',
          })
        } catch {
          toast.error('Failed to copy', {
            description: 'Please copy the link manually.',
          })
        }
        break
    }
  }

  return (
    <div className="text-center">
      <Separator className="mb-6" />
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Share this slam</h3>
        <p className="text-muted-foreground">Help spread the word about this awesome challenge!</p>
      </div>
      <TooltipProvider>
        <div className="flex justify-center space-x-4">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={() => handleShare('twitter')} />}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </TooltipTrigger>
            <TooltipContent>Share on X (Twitter)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={() => handleShare('bluesky')} />}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-2.67-.296-5.568.628-6.383 3.364C.378 17.703 0 22.661 0 23.349c0 .688.139 1.86.902 2.202.659.299 1.664.621 4.3-1.24 2.752-1.942 5.711-5.881 6.798-7.995 1.087 2.114 4.046 6.053 6.798 7.995 2.636 1.861 3.641 1.539 4.3 1.24.763-.342.902-1.514.902-2.202 0-.688-.378-5.646-.624-6.475-.815-2.736-3.713-3.66-6.383-3.364-.139.016-.277.034-.415.056.138-.017.276-.036.415-.056 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.202-.659-.299-1.664-.621-4.3 1.24-2.752 1.942-5.711 5.881-6.798 7.995z" />
              </svg>
            </TooltipTrigger>
            <TooltipContent>Share on Bluesky</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" onClick={() => handleShare('copy')} />}>
              <Copy className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Copy link</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
