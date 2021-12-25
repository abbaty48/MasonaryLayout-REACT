import React, { PureComponent, useEffect, useState } from 'react'

interface IInfinitScrollerProps {
   loadMore: boolean;
   callBack: () => void;
   loadOnMount?: boolean;
}

interface IMasonryProps {
   /**
    * This is the minimum column width. Masonry will automatically size your 
    * columns to fill its container based on your provided columnWidth and 
    * columnGutter values. It will never render anything smaller than this 
    * defined width unless its container is smaller than its value.
    */
   columnsWidth?: number;
   /**
    * This sets the horizontal space between grid columns in pixels. If rowGutter is not set, 
    * this also sets the vertical space between cells within a column in pixels.
    */
   columnGutter?: number;
   /**
    * This sets the vertical space between cells within a column in pixels.
    */
   rowGutter?: number;
   /**
    * By default, Masonry derives the column count from the columnWidth prop
    */
   columnCount?: number;
   /** 
    * Inner space between the masonry and the columns
   */
   innerGutter?: number;
   /** 
    * 
    * */
   items: any[];
   /** 
    * */
   ItemComponent: React.ComponentType<{ data: any }>;
   /** 
    * */
   // MasonaryInfinitScroller?: typeof MasonaryInfinitScroller
   /** 
    * 
   */
   useIS?: boolean;
   /**
    * 
    */
   ISCallback?: () => void;
   /**
    * 
    */
   ISLoadOnMount?: boolean;
   /** 
    * 
   */
  ISLoadMore?: boolean;
  /**
   * 
   */
  ISLoading?: boolean;

}
interface IMasonryStates {
   items?: any[];
}

type IMasonaryInfinitScroller<p> = React.FC<p> & {
   MasonaryInfinitScroller: any
}

export const MasonaryInfinitScroller: React.FC<IInfinitScrollerProps> = (props) => {

   useEffect(() => {
      window.addEventListener('scroll', onScroll);
   }, [])


   const onScroll = () => {

      const { callBack, loadMore, loadOnMount } = props;

      if (loadOnMount) {
         callBack();
      }

      if ((window.scrollY + window.innerHeight) >= document.body.scrollHeight) {
         callBack();
         window.removeEventListener('scroll', onScroll);
      } // end if
   } // end onScroll

   return (
      <div className='masonry-data-container'> {props.children} </div>
   ) // end return
} // end onScroll

const Masonry: React.FC<IMasonryProps> = (
     {  items, ItemComponent, 
         ISCallback,ISLoadMore,
         ISLoadOnMount,columnGutter,
         columnCount, columnsWidth,
         innerGutter,rowGutter,
         useIS,ISLoading
      }
   ) => {

   // const layoutRef = React.createRef<HTMLDivElement>()
   const layoutRef = React.useRef<HTMLDivElement>(null)
   // const [datas, setDatas] = useState<any[]>(items)
   const [InitialLoads, setInitialLoads] = useState(true)
   const __columnCount = columnCount ?? 'auto';
   const __columnsWidth = columnsWidth ?? 240;
   
   const MASONRY_LayoutStyle: React.CSSProperties = {
      columnGap: rowGutter ?? '15px',
      padding: innerGutter ?? '16px',
      columnCount: __columnCount,
      columnWidth: `${__columnsWidth}px`,
   }
   const MASONRY_ItemStyle: React.CSSProperties = {
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
   }

   useEffect(() => {
      
      if (useIS && ISLoadOnMount && InitialLoads) {
         ISCallback?.call(this)
         setInitialLoads(false)
      }
   }, [ISCallback, ISLoadOnMount, InitialLoads])

   useEffect(() => {
   
      if (useIS) {
         const onScroll = () => {
               if ( ! ISLoading && ISLoadMore && isBottom(layoutRef)) {
                     ISCallback?.call(this)
                  } // end if
               } // end onScroll
               window.addEventListener('scroll', onScroll);

               return () => window.removeEventListener('scroll', onScroll);
         }
   }, [ISCallback, ISLoadMore, ISLoading])

   const isBottom =  (ref:  React.RefObject<HTMLElement>) =>  {
      if (!ref.current) {
         return false
      }
     return Math.floor(ref.current.getBoundingClientRect().bottom) <= window.innerHeight
   }

   const reRender = (items: any[]) => {
      let colIndex = 0;
      const resultOut = [];
      const numOfColumns =  String(__columnCount) === 'auto' ? 
                                                      Math.floor(layoutRef!.current!.clientWidth / __columnsWidth) : 
                                                      Number(__columnCount)

      while (colIndex < numOfColumns) {
         for (let index = 0; index < items.length; index += numOfColumns) {
            const element = items[index + colIndex];
            if (element !== undefined) {
               resultOut.push(element);
            }
         } // end for index
         colIndex++
      } // end while loop

      return resultOut
   } // end reRender

   return (
      <div className="masonryLayout" style={MASONRY_LayoutStyle} ref={layoutRef}>
            {
               reRender(items)?.map((child, index) => {
                  return <div key={index} style={MASONRY_ItemStyle}><ItemComponent key={index} data={child} /></div>
               })
            }
         </div>
      )
}

export default Masonry