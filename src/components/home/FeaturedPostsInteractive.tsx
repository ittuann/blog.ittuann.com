import { create } from "zustand";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { GlareHover } from "@/components/ui/glare-hover";
import { Pointer } from "@/components/ui/pointer";
import { SpinningText } from "@/components/ui/spinning-text";

interface PostData {
  id: string;
  title: string;
  description: string;
  heroImageSrc: string | null;
  category: string[];
  tags: string[];
}

interface FeaturedPostsState {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const useFeaturedPostsStore = create<FeaturedPostsState>((set) => ({
  selectedIndex: 0,
  setSelectedIndex: (index) => set({ selectedIndex: index }),
}));

export function FeaturedPostsInteractive({
  posts,
  maxPosts = 4,
}: {
  posts: PostData[];
  maxPosts?: number;
}) {
  const { selectedIndex, setSelectedIndex } = useFeaturedPostsStore();
  const displayPosts = posts.slice(0, maxPosts);
  const selected = displayPosts[selectedIndex];

  if (!selected) return null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Left: list of pinned posts */}
      <BlurFade inView>
        <div className="flex flex-col gap-4">
          {displayPosts.map((post, i) => (
            <button
              key={post.id}
              onClick={() => setSelectedIndex(i)}
              className={`cursor-pointer rounded-xl border-l-4 p-4 text-left transition-colors ${
                i === selectedIndex
                  ? "border-l-primary/80 bg-card/85 shadow-sm"
                  : "hover:bg-secondary/70 border-l-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                {post.heroImageSrc && (
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md">
                    <img
                      src={post.heroImageSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-foreground mb-1 text-lg leading-tight font-semibold">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs font-semibold tracking-wider">
                      {post.category[0] ?? "blog"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </BlurFade>

      {/* Right: selected post detail */}
      <div className="lg:col-span-2">
        <BlurFade inView>
          <GlareHover
            width="100%"
            background="transparent"
            className="rounded-3xl"
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={selectedIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  window.location.href = `/posts/${selected.id}/`;
                }}
                whileHover="hovered"
                className="border-border/30 bg-card/90 hover:shadow-primary/10 flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex h-full flex-col overflow-hidden md:flex-row">
                  <div className="flex flex-grow flex-col p-6 md:w-1/2">
                    <h3 className="text-foreground mb-4 text-2xl leading-tight font-bold">
                      {selected.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-4 text-lg">
                      {selected.description}
                    </p>
                    <div className="mb-6 flex items-center gap-2">
                      <span className="bg-secondary text-primary rounded-full px-2 py-0.5 text-xs font-semibold tracking-wider">
                        {selected.category[0] ?? "blog"}
                      </span>
                    </div>
                    <motion.a
                      href={`/posts/${selected.id}/`}
                      className="text-primary hover:text-primary/80 mt-auto inline-flex items-center gap-1 text-sm font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read article
                      <motion.span
                        variants={{ hovered: { x: 5 } }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                      >
                        <IconArrowNarrowRight stroke={2} />
                      </motion.span>
                    </motion.a>
                  </div>
                  {selected.heroImageSrc && (
                    <div className="w-full p-2 md:w-1/2">
                      <img
                        src={selected.heroImageSrc}
                        alt="Featured post hero image"
                        className="h-full min-h-48 w-full rounded-2xl object-cover"
                      />
                    </div>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </GlareHover>
        </BlurFade>

        <Pointer>
          <SpinningText
            reverse
            className="text-accent-foreground/80 text-base"
            duration={10}
            radius={5}
          >
            DISCOVER • OPEN • EXPLORE •
          </SpinningText>
        </Pointer>
      </div>
    </div>
  );
}

export default FeaturedPostsInteractive;
