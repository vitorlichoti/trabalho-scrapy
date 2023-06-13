from parsel import Selector
from css_classes import (
    value_selector_builder,
    request_data_url,
    header_content_builder,
    indicators_fundamentalists_container,
    contabil_info_container,
    )


class SpiderStatusInvest():

    def response_acao_data(self, acao_cod: str) -> str:
        url_acao = f"https://statusinvest.com.br/acoes/{acao_cod.lower()}"
        headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'}

        html_content = request_data_url(url_acao, headers)

        head_content = header_content_builder(Selector(html_content.text))

        actual_value = value_selector_builder(head_content)

        indicators = indicators_fundamentalists_container(head_content)

        contabil_info_container(Selector(html_content.text))

        return {**actual_value, **indicators}
