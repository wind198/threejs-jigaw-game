import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections, collectionPuzzles, requirePuzzle } from '../../content/collections';
export function CollectionCard({ collection }: { collection: typeof collections[number] }) {
  const cover = requirePuzzle(collection.coverId);
  return <Link className={'collection-card collection-card--' + collection.slug} href={'/puzzles/' + collection.slug + '/'}>
    <img src={cover.image} alt="" width={320} height={320} loading="lazy" decoding="async"/>
    <div className="collection-caption"><span className="collection-category">{collection.category}</span><strong>{collection.title}</strong><span className="collection-count">{collectionPuzzles(collection.category).length} pictures <ArrowRight size={18} aria-hidden/></span></div>
  </Link>;
}
