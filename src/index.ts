import { Observable } from "rxjs";

export class RxResizeObserver {
  private static defaultOptions?: ResizeObserverOptions;

  static setDefaultOptions(defaultOptions?: ResizeObserverOptions) {
    this.defaultOptions = defaultOptions;
  }

  static observe(target: Element, options?: ResizeObserverOptions): Observable<ResizeObserverEntry[]>;
  static observe(targets: Element[], options?: ResizeObserverOptions): Observable<ResizeObserverEntry[]>;
  static observe(targetOrTargets: Element | Element[], options?: ResizeObserverOptions): Observable<ResizeObserverEntry[]> {
    const targets = Array.isArray(targetOrTargets) ? targetOrTargets.slice() : [targetOrTargets];

    return new Observable<ResizeObserverEntry[]>(subscriber => {
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        subscriber.next(entries);
      });

      subscriber.add(() => {
        for(const target of targets) {
          resizeObserver.unobserve(target);
        }

        resizeObserver.disconnect();
      });

      for(const target of targets) {
        resizeObserver.observe(target, options ?? this.defaultOptions);
      }
    });
  }
}
