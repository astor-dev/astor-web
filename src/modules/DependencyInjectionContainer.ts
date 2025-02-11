// 간단한 DI 컨테이너 구현 (인스턴스 직접 등록 기능 추가)
type Constructor<T> = new (...args: any[]) => T;

export class DependencyInjectionContainer {
  private services = new Map<Symbol, any>();

  // 클래스 생성자를 통해 서비스 등록 (싱글톤 패턴)
  public register<T>(token: Symbol, ctor: Constructor<T>): void {
    if (!this.services.has(token)) {
      this.services.set(token, new ctor());
    }
  }

  /**
   * 의존성 토큰 배열을 전달받아, 생성자 인자로 주입한 후 인스턴스를 생성하여 등록합니다.
   *
   * @param token 등록할 서비스 토큰
   * @param ctor 생성자 (클래스)
   * @param dependencyTokens 생성자에서 필요한 의존성들의 토큰 배열
   */
  public registerWithDependencies<T>(
    token: Symbol,
    ctor: Constructor<T>,
    dependencyTokens: Symbol[],
  ): void {
    if (!this.services.has(token)) {
      const dependencies = dependencyTokens.map(depToken => this.get(depToken));
      this.services.set(token, new ctor(...dependencies));
    }
  }

  // 미리 생성된 인스턴스를 직접 등록
  public registerInstance<T>(token: Symbol, instance: T): void {
    if (!this.services.has(token)) {
      this.services.set(token, instance);
    }
  }

  // 서비스 조회
  public get<T>(token: Symbol): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`${String(token)} is not registered in the container`);
    }
    return service;
  }
}
